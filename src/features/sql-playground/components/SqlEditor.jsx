import { useState, useTransition } from "react";
import ResultView from "./ResultView";
import RunButton from "./RunButton";
import { resetDb } from "../db/client";
import { useSqlRunner } from "../hooks/useSqlRunner";

/**
 * Controlled SQL editor; the page owns the text so gallery cards can fill it.
 * @param {{
 *   sql: string,
 *   onSqlChange: (sql: string) => void,
 *   dbState: import("../db/client").DbStatus["state"],
 *   textareaRef: import("react").Ref<HTMLTextAreaElement>,
 * }} props
 */
export default function SqlEditor({ sql, onSqlChange, dbState, textareaRef }) {
  const { result, isPending, run, clear } = useSqlRunner();
  const [isResetting, startReset] = useTransition();
  const [notice, setNotice] = useState("");

  function runEditor() {
    if (dbState !== "ready" || isPending || isResetting || sql.trim() === "") return;
    setNotice("");
    run(sql);
  }

  function reset() {
    startReset(async () => {
      await resetDb();
      startReset(() => {
        clear();
        setNotice("Database reset to the original seed data.");
      });
    });
  }

  /** @param {import("react").KeyboardEvent<HTMLTextAreaElement>} event */
  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      runEditor();
    }
  }

  return (
    <div className="rounded-xl border-2 border-white/20 bg-black/60 p-4 md:p-5">
      <label htmlFor="sql-editor" className="font-vt text-2xl md:text-3xl text-white">
        SQL editor
      </label>
      <p id="sql-editor-hint" className="font-vt text-xl text-white/60">
        Ctrl+Enter (Cmd+Enter on Mac) runs the query. Tab moves focus out of the editor.
      </p>
      <textarea
        id="sql-editor"
        ref={textareaRef}
        value={sql}
        onChange={(event) => onSqlChange(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-describedby="sql-editor-hint"
        rows={12}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="mt-2 block w-full resize-y rounded-lg border-2 border-white/25 bg-neutral-950 p-3 font-mono text-base leading-relaxed text-emerald-100 focus:border-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <RunButton dbState={dbState} isPending={isPending || isResetting} onClick={runEditor} />
        <button
          type="button"
          onClick={reset}
          disabled={dbState !== "ready" || isPending || isResetting}
          className="rounded-lg border-2 border-white/60 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/40 disabled:hover:bg-transparent"
        >
          {isResetting ? "Resetting…" : "Reset database"}
        </button>
      </div>
      <p aria-live="polite" className={notice ? "mt-3 font-mono text-sm md:text-base text-emerald-300" : "sr-only"}>
        {notice}
      </p>
      <ResultView result={result} isPending={isPending} />
    </div>
  );
}
