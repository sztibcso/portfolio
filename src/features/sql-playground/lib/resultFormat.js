// Pure helpers for the result display (no React), covered by resultFormat.test.js.

export const MAX_DISPLAY_ROWS = 200;

/**
 * @template T
 * @param {T[]} rows
 * @param {number} [max]
 * @returns {{ rows: T[], total: number, truncated: boolean }}
 */
export function limitRows(rows, max = MAX_DISPLAY_ROWS) {
  return {
    rows: rows.length > max ? rows.slice(0, max) : rows,
    total: rows.length,
    truncated: rows.length > max,
  };
}

/**
 * Text for one table cell, or null for SQL NULL (rendered as a muted label).
 * @param {unknown} value
 * @returns {string | null}
 */
export function formatCell(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") {
    return String(value);
  }
  if (value instanceof Uint8Array) {
    return "\\x" + Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  return JSON.stringify(value, (_key, v) => (typeof v === "bigint" ? v.toString() : v));
}

/** @param {number} ms */
export function formatDuration(ms) {
  return ms < 10 ? `${ms.toFixed(1)} ms` : `${Math.round(ms)} ms`;
}

/** @param {number} n @param {string} word */
const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * One-line summary shown under a result and announced to screen readers.
 * @param {import("../db/client").SqlRunResult} result
 * @returns {string}
 */
export function summarizeResult(result) {
  const time = formatDuration(result.durationMs);
  if (!result.ok) {
    return result.code ? `Error ${result.code} after ${time}` : `Error after ${time}`;
  }
  if (result.fields.length === 0) {
    return result.affectedRows === undefined
      ? `Query OK (${time})`
      : `Query OK, ${plural(result.affectedRows, "row")} affected (${time})`;
  }
  const { total, truncated } = limitRows(result.rows);
  return truncated
    ? `Showing first ${MAX_DISPLAY_ROWS} of ${total} rows (${time})`
    : `${plural(total, "row")} (${time})`;
}
