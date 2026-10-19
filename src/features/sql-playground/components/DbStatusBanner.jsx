const MB = 1_000_000;

/**
 * Download progress while PostgreSQL starts, and a retryable error if it fails.
 * Everything else on the page works without the database.
 * @param {{
 *   state: "idle" | "loading" | "ready" | "error",
 *   message?: string,
 *   loadedBytes?: number,
 *   totalBytes?: number,
 *   onRetry: () => void,
 * }} props
 */
export default function DbStatusBanner({ state, message, loadedBytes = 0, totalBytes = 0, onRetry }) {
  const downloading = state === "loading" && totalBytes > 0 && loadedBytes < totalBytes;

  return (
    <div className="font-mono text-sm md:text-base">
      {/* Only phase changes are announced; byte counts would be too chatty. */}
      <p aria-live="polite" className="sr-only">
        {state === "loading" ? "Starting PostgreSQL in your browser." : state === "ready" ? "PostgreSQL is ready." : ""}
      </p>

      {(state === "idle" || state === "loading") && (
        <div className="rounded-lg border-2 border-white/20 bg-white/[0.04] p-4">
          <p>
            {downloading
              ? `Downloading PostgreSQL… ${(loadedBytes / MB).toFixed(1)} / ${(totalBytes / MB).toFixed(1)} MB`
              : "Starting PostgreSQL in your browser…"}
          </p>
          <progress
            className="mt-2 h-2 w-full accent-red-600"
            max={totalBytes || undefined}
            value={totalBytes ? loadedBytes : undefined}
            aria-label="PostgreSQL download progress"
          />
        </div>
      )}

      {state === "error" && (
        <div role="alert" className="rounded-lg border-2 border-red-500/80 bg-red-950/40 p-4">
          <p className="font-bold text-red-300">✕ PostgreSQL could not start in your browser.</p>
          <p className="mt-2 break-words text-white/80">{message}</p>
          <p className="mt-2 text-white/70">
            The diagram, design notes and SQL on this page still work. Check your connection and try again.
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
