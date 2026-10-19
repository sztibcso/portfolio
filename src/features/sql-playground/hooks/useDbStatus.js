import { useEffect, useSyncExternalStore } from "react";
import { getDbStatus, loadDb, subscribeDbStatus } from "../db/client";

/** Upper bound on how long the start waits for the page's own content. */
const START_FALLBACK_MS = 3000;

// Load failures are surfaced through the status store, not the promise.
const startLoading = () => loadDb().catch(() => {});

/**
 * Tracks the in-browser PostgreSQL instance and starts it in the background,
 * so static content never waits for the WASM download.
 * @param {boolean} startNow true once the page's own content has loaded (e.g. the
 *   ER diagram), so the ~19 MB download does not compete with it on slow links;
 *   loading starts after START_FALLBACK_MS regardless.
 * @returns {import("../db/client").DbStatus & { retry: () => void }}
 */
export function useDbStatus(startNow) {
  const status = useSyncExternalStore(subscribeDbStatus, getDbStatus);

  useEffect(() => {
    if (startNow) {
      startLoading();
      return undefined;
    }
    const timer = setTimeout(startLoading, START_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [startNow]);

  return { ...status, retry: startLoading };
}
