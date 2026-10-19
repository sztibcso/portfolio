import { useEffect, useSyncExternalStore } from "react";
import { getDbStatus, loadDb, subscribeDbStatus } from "../db/client";

// Load failures are surfaced through the status store, not the promise.
const startLoading = () => loadDb().catch(() => {});

/**
 * Tracks the in-browser PostgreSQL instance and starts it in the background
 * on mount, so static content never waits for the WASM download.
 * @returns {{ state: "idle" | "loading" | "ready" | "error", message?: string, retry: () => void }}
 */
export function useDbStatus() {
  const status = useSyncExternalStore(subscribeDbStatus, getDbStatus);

  useEffect(() => {
    startLoading();
  }, []);

  return { ...status, retry: startLoading };
}
