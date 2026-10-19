/**
 * Run button that reflects both the database start-up and the query in flight.
 * @param {{
 *   dbState: "idle" | "loading" | "ready" | "error",
 *   isPending: boolean,
 *   onClick: () => void,
 *   label?: string,
 *   ariaLabel?: string,
 * }} props
 */
export default function RunButton({ dbState, isPending, onClick, label = "Run", ariaLabel }) {
  const starting = dbState === "idle" || dbState === "loading";
  const disabled = dbState !== "ready" || isPending;
  const text = starting
    ? "Starting PostgreSQL in your browser…"
    : dbState === "error"
      ? "Database unavailable"
      : isPending
        ? "Running…"
        : label;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={!disabled && ariaLabel ? ariaLabel : undefined}
      aria-busy={starting || isPending}
      className="bg-red-600 text-white font-bold text-sm px-4 py-2 border-2 border-black rounded-lg shadow-[3px_3px_0_0_rgba(255,255,255,0.35)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_rgba(255,255,255,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-white/70 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
    >
      {text}
    </button>
  );
}
