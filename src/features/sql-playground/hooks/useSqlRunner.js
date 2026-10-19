import { useState, useTransition } from "react";
import { runSql } from "../db/client";

/**
 * Runs SQL against the shared playground database and keeps the latest result.
 * @returns {{
 *   result: import("../db/client").SqlRunResult | null,
 *   isPending: boolean,
 *   run: (sql: string) => void,
 *   clear: () => void,
 * }}
 */
export function useSqlRunner() {
  const [result, setResult] = useState(
    /** @type {import("../db/client").SqlRunResult | null} */ (null)
  );
  const [isPending, startTransition] = useTransition();

  /** @param {string} sql */
  function run(sql) {
    startTransition(async () => {
      let next;
      try {
        next = await runSql(sql);
      } catch (error) {
        // Only reached when PostgreSQL itself failed to start.
        next = {
          ok: false,
          message: `PostgreSQL could not start: ${error instanceof Error ? error.message : String(error)}`,
          durationMs: 0,
        };
      }
      startTransition(() => setResult(next));
    });
  }

  return { result, isPending, run, clear: () => setResult(null) };
}
