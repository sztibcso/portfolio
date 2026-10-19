import ErrorPanel from "./ErrorPanel";
import ResultTable from "./ResultTable";
import { limitRows, summarizeResult } from "../lib/resultFormat";

/**
 * Shared result area for gallery cards and the editor.
 * @param {{
 *   result: import("../db/client").SqlRunResult | null,
 *   isPending: boolean,
 *   expectedErrorCode?: string,
 * }} props
 */
export default function ResultView({ result, isPending, expectedErrorCode }) {
  const expected = Boolean(result && !result.ok && expectedErrorCode && result.code === expectedErrorCode);

  return (
    <div className="mt-4 space-y-2">
      <p aria-live="polite" className="sr-only">
        {isPending ? "Running query…" : result ? announce(result, expected) : ""}
      </p>
      {isPending && <p className="font-mono text-sm md:text-base text-white/70">Running query…</p>}
      {!isPending && result && (
        <>
          <p className="font-mono text-sm md:text-base text-white/70">{summarizeResult(result)}</p>
          <ResultBody result={result} expected={expected} />
        </>
      )}
    </div>
  );
}

/**
 * @param {import("../db/client").SqlRunResult} result
 * @param {boolean} expected
 */
function announce(result, expected) {
  if (result.ok) return summarizeResult(result);
  return [
    expected ? "Constraint worked as designed." : "Query failed.",
    result.message,
    result.code && `SQLSTATE ${result.code}.`,
    result.rolledBack && "The transaction was rolled back automatically; the database is usable again.",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * @param {{ result: import("../db/client").SqlRunResult, expected: boolean }} props
 */
function ResultBody({ result, expected }) {
  if (!result.ok) return <ErrorPanel error={result} expected={expected} />;
  if (result.fields.length === 0) return null;
  if (result.rows.length === 0) {
    return <p className="font-mono text-sm md:text-base text-white/60">The query returned no rows.</p>;
  }
  return <ResultTable fields={result.fields} rows={limitRows(result.rows).rows} />;
}
