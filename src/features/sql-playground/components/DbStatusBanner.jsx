/**
 * Shown only when PostgreSQL failed to start; everything else on the page keeps working.
 * @param {{ state: "idle" | "loading" | "ready" | "error", message?: string, onRetry: () => void }} props
 */
export default function DbStatusBanner({ state, message, onRetry }) {
  return (
    <div aria-live="polite">
      {state === "error" && (
        <div className="rounded-lg border-2 border-red-500/80 bg-red-950/40 p-4 font-mono text-sm md:text-base">
          <p className="font-bold text-red-300">✕ PostgreSQL could not start in your browser.</p>
          <p className="mt-2 break-words text-white/80">{message}</p>
          <p className="mt-2 text-white/70">
            The diagram, design notes and SQL below still work. Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 bg-white text-black font-bold text-sm px-4 py-2 border-2 border-black rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
