/**
 * @param {{
 *   error: import("../db/client").SqlRunFailure,
 *   expected?: boolean,
 * }} props
 */
export default function ErrorPanel({ error, expected = false }) {
  return (
    <div
      className={`rounded-lg border-2 p-4 font-mono text-sm md:text-base ${
        expected ? "border-emerald-400/70 bg-emerald-950/40" : "border-red-500/80 bg-red-950/40"
      }`}
    >
      <p className={`font-bold ${expected ? "text-emerald-300" : "text-red-300"}`}>
        {expected ? "✓ Constraint worked as designed" : "✕ Query failed"}
        {error.code && <span className="ml-2 font-normal text-white/70">SQLSTATE {error.code}</span>}
      </p>
      <p className="mt-2 break-words">{error.message}</p>
      {error.detail && (
        <p className="mt-2 break-words text-white/80">
          <span className="text-white/50">Detail: </span>
          {error.detail}
        </p>
      )}
      {error.hint && (
        <p className="mt-2 break-words text-white/80">
          <span className="text-white/50">Hint: </span>
          {error.hint}
        </p>
      )}
      {error.rolledBack && (
        <p className="mt-3 border-t border-white/15 pt-2 text-amber-200">
          The open transaction was rolled back automatically, so the database is usable again.
        </p>
      )}
    </div>
  );
}
