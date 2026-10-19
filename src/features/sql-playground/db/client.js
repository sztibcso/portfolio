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
 * @typedef {{ state: "idle" | "loading" | "ready" | "error", message?: string }} DbStatus
 */

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

/** @param {string} file */
async function download(file) {
  const response = await fetch(PGLITE_BASE + file);
  if (!response.ok) throw new Error(`Could not download ${file} (HTTP ${response.status}).`);
  return response;
}

async function createDb() {
  // PGlite's own artifact download never settles when a fetch fails, so the
  // binaries are fetched here and handed over, letting failures reject.
  const [{ PGlite }, pgliteWasmModule, initdbWasmModule, fsBundle] = await Promise.all([
    import(/* webpackIgnore: true */ PGLITE_BASE + "index.js"),
    WebAssembly.compileStreaming(download("pglite.wasm")),
    WebAssembly.compileStreaming(download("initdb.wasm")),
    download("pglite.data").then((response) => response.blob()),
  ]);
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
    const attempt = createDb();
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
