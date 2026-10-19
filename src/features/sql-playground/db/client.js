import { SCHEMA_SQL } from "../data/schema";
import { SEED_SQL } from "../data/seed";

// Self-hosted by scripts/copy-pglite.mjs. CRA's webpack cannot bundle PGlite,
// so the browser loads it as a native ES module from the site root.
const PGLITE_BASE = "/vendor/pglite/";

// Keep date/time values as PostgreSQL's own text output instead of JS Dates.
const keepText = (value) => value;
const TEXT_PARSERS = Object.freeze({
  1082: keepText, // date
  1083: keepText, // time
  1114: keepText, // timestamp
  1184: keepText, // timestamptz
  1266: keepText, // timetz
});

/**
 * Rows are arrays (one cell per field) so duplicate column names such as
 * `SELECT * FROM event JOIN venue` keep every value.
 * @typedef {{ ok: true, fields: string[], rows: unknown[][], affectedRows?: number, durationMs: number }} SqlRunSuccess
 * @typedef {{ ok: false, message: string, code?: string, detail?: string, hint?: string, rolledBack?: boolean, durationMs: number }} SqlRunFailure
 * @typedef {SqlRunSuccess | SqlRunFailure} SqlRunResult
 */

/**
 * `loadedBytes` / `totalBytes` are set while the binaries download.
 * @typedef {{ state: "idle" | "loading" | "ready" | "error", message?: string, loadedBytes?: number, totalBytes?: number }} DbStatus
 */

/** A download that receives no bytes for this long counts as failed. */
const STALL_TIMEOUT_MS = 20_000;
const PROGRESS_INTERVAL_MS = 100;

/** @type {Promise<any> | null} */
let dbPromise = null;

/** @type {Readonly<DbStatus>} */
let status = Object.freeze({ state: "idle" });
/** @type {Set<() => void>} */
const listeners = new Set();

/** @param {DbStatus} next */
function setStatus(next) {
  status = Object.freeze(next);
  listeners.forEach((listener) => listener());
}

/** @returns {Readonly<DbStatus>} */
export function getDbStatus() {
  return status;
}

/**
 * @param {() => void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribeDbStatus(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * @param {string} file
 * @param {AbortSignal} signal
 * @param {(bytes: number) => void} [onBytes]
 * @returns {Promise<Response>}
 */
async function download(file, signal, onBytes) {
  // Low priority so the page's own chunks (e.g. Mermaid) are not starved on slow links.
  const response = await fetch(PGLITE_BASE + file, { signal, priority: "low" });
  if (!response.ok) throw new Error(`Could not download ${file} (HTTP ${response.status}).`);
  if (!onBytes || !response.body) return response;
  const counter = new TransformStream({
    transform(chunk, controller) {
      onBytes(chunk.byteLength);
      controller.enqueue(chunk);
    },
  });
  // Explicit type so compileStreaming works even if the host serves .wasm wrongly.
  const type = file.endsWith(".wasm") ? "application/wasm" : "application/octet-stream";
  return new Response(response.body.pipeThrough(counter), { headers: { "content-type": type } });
}

/**
 * @typedef {{ PGlite: any, pgliteWasmModule: WebAssembly.Module, initdbWasmModule: WebAssembly.Module, fsBundle: Blob }} Artifacts
 */

/** Downloaded once and reused by resetDb(). @type {Promise<Artifacts> | null} */
let artifactsPromise = null;

/**
 * PGlite's own artifact download never settles when a fetch fails, so the
 * binaries are fetched here and handed over, letting failures reject.
 * @param {(progress: { loadedBytes: number, totalBytes: number }) => void} onProgress
 * @returns {Promise<Artifacts>}
 */
async function downloadArtifacts(onProgress) {
  const controller = new AbortController();
  let rejectStall = () => {};
  const stalled = new Promise((_, reject) => {
    rejectStall = reject;
  });
  let timer = 0;
  const kick = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      controller.abort();
      rejectStall(new Error(`The download stalled: no data received for ${STALL_TIMEOUT_MS / 1000} seconds.`));
    }, STALL_TIMEOUT_MS);
  };

  let loadedBytes = 0;
  let totalBytes = 0;
  let lastReport = 0;
  /** @param {number} bytes */
  const onBytes = (bytes) => {
    kick();
    loadedBytes += bytes;
    const now = performance.now();
    if (now - lastReport >= PROGRESS_INTERVAL_MS || loadedBytes >= totalBytes) {
      lastReport = now;
      onProgress({ loadedBytes, totalBytes });
    }
  };

  kick();
  try {
    const manifest = await Promise.race([
      download("manifest.json", controller.signal).then((response) => response.json()),
      stalled,
    ]);
    totalBytes = Object.values(manifest.sizes).reduce((sum, size) => sum + size, 0);
    onProgress({ loadedBytes, totalBytes });

    // index.js cannot be byte-counted (native import), but it downloads in
    // parallel with the binaries, so a stall there still trips the watchdog.
    const [{ PGlite }, pgliteWasmModule, initdbWasmModule, fsBundle] = await Promise.race([
      Promise.all([
        import(/* webpackIgnore: true */ PGLITE_BASE + "index.js"),
        WebAssembly.compileStreaming(download("pglite.wasm", controller.signal, onBytes)),
        WebAssembly.compileStreaming(download("initdb.wasm", controller.signal, onBytes)),
        download("pglite.data", controller.signal, onBytes).then((response) => response.blob()),
      ]),
      stalled,
    ]);
    return { PGlite, pgliteWasmModule, initdbWasmModule, fsBundle };
  } finally {
    clearTimeout(timer);
  }
}

/** @param {(progress: { loadedBytes: number, totalBytes: number }) => void} onProgress */
async function createDb(onProgress) {
  if (!artifactsPromise) {
    artifactsPromise = downloadArtifacts(onProgress).catch((error) => {
      artifactsPromise = null;
      throw error;
    });
  }
  const { PGlite, pgliteWasmModule, initdbWasmModule, fsBundle } = await artifactsPromise;
  const db = await PGlite.create({
    pgliteWasmModule,
    initdbWasmModule,
    fsBundle,
    parsers: TEXT_PARSERS,
  });
  await db.exec("SET TimeZone = 'Europe/Budapest';");
  await db.exec(SCHEMA_SQL);
  await db.exec(SEED_SQL);
  return db;
}

/**
 * Starts (or joins) the one-time initialisation. A failed attempt is forgotten,
 * so calling it again retries.
 * @returns {Promise<any>} the PGlite instance
 */
export function loadDb() {
  if (!dbPromise) {
    const attempt = createDb((progress) => {
      if (dbPromise === attempt) setStatus({ state: "loading", ...progress });
    });
    dbPromise = attempt;
    setStatus({ state: "loading" });
    // Ignore outcomes of an attempt that resetDb() has already replaced.
    attempt.then(
      () => {
        if (dbPromise === attempt) setStatus({ state: "ready" });
      },
      (error) => {
        if (dbPromise !== attempt) return;
        dbPromise = null;
        setStatus({ state: "error", message: readString(error, "message") ?? String(error) });
      }
    );
  }
  return dbPromise;
}

/** @param {unknown} error @param {string} key */
function readString(error, key) {
  if (typeof error !== "object" || error === null) return undefined;
  const value = /** @type {Record<string, unknown>} */ (error)[key];
  return typeof value === "string" && value !== "" ? value : undefined;
}

/**
 * Runs one or more statements. SQL errors resolve to `{ ok: false }`; only a
 * failure to start the database rejects.
 * @param {string} sql
 * @returns {Promise<SqlRunResult>}
 */
export async function runSql(sql) {
  const db = await loadDb();
  const started = performance.now();
  try {
    const results = await db.exec(sql, { rowMode: "array" });
    const durationMs = performance.now() - started;
    const lastSet = results.findLast((r) => r.fields.length > 0);
    if (lastSet) {
      return {
        ok: true,
        fields: lastSet.fields.map((f) => f.name),
        rows: lastSet.rows,
        durationMs,
      };
    }
    // PGlite's affectedRows is cumulative across statements; rowCount is per statement.
    const last = results.at(-1);
    return {
      ok: true,
      fields: [],
      rows: [],
      affectedRows: typeof last?.rowCount === "number" ? last.rowCount : undefined,
      durationMs,
    };
  } catch (error) {
    const durationMs = performance.now() - started;
    // A failed statement inside BEGIN leaves the session aborted (25P02 on
    // every later query), so roll back to keep the playground usable.
    const rolledBack = db.isInTransaction();
    if (rolledBack) await db.exec("ROLLBACK;");
    return {
      ok: false,
      message: readString(error, "message") ?? String(error),
      code: readString(error, "code"),
      detail: readString(error, "detail"),
      hint: readString(error, "hint"),
      rolledBack: rolledBack || undefined,
      durationMs,
    };
  }
}

/**
 * Throws away the current database and rebuilds it from schema + seed.
 * @returns {Promise<void>}
 */
export async function resetDb() {
  const previous = dbPromise;
  dbPromise = null;
  if (previous) {
    try {
      await (await previous).close();
    } catch {
      // The old instance failed to start or is already closed; nothing to clean up.
    }
  }
  await loadDb();
}
