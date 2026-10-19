import CodeBlock from "./CodeBlock";
import ResultView from "./ResultView";
import RunButton from "./RunButton";
import { useSqlRunner } from "../hooks/useSqlRunner";

/**
 * @param {{
 *   query: import("../data/queries").GalleryQuery,
 *   dbState: import("../db/client").DbStatus["state"],
 *   onOpenInEditor: (sql: string) => void,
 * }} props
 */
export default function QueryCard({ query, dbState, onOpenInEditor }) {
  const { result, isPending, run } = useSqlRunner();
  const expectsError = Boolean(query.expectedErrorCode);

  return (
    <li className="rounded-xl border-2 border-white/20 bg-black/60 p-4 md:p-5 shadow-[6px_6px_0_0_rgba(255,255,255,0.08)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-vt text-2xl md:text-3xl text-white">{query.title}</h3>
        <span
          className={`rounded border px-2 py-0.5 font-mono text-xs uppercase tracking-wider ${
            expectsError ? "border-amber-300/60 text-amber-200" : "border-red-400/60 text-red-300"
          }`}
        >
          {query.concept}
        </span>
      </div>
      <p className="mt-2 mb-3 font-vt text-xl md:text-2xl leading-snug text-white/80">{query.explanation}</p>
      <CodeBlock code={query.sql} label={`SQL for ${query.title}`} />
      <div className="mt-3 flex flex-wrap gap-3">
        <RunButton
          dbState={dbState}
          isPending={isPending}
          onClick={() => run(query.sql)}
          label={expectsError ? "Run (expect an error)" : "Run"}
          ariaLabel={`Run: ${query.title}`}
        />
        <button
          type="button"
          onClick={() => onOpenInEditor(query.sql)}
          aria-label={`Open in editor: ${query.title}`}
          className="rounded-lg border-2 border-white/60 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Open in editor
        </button>
      </div>
      <ResultView result={result} isPending={isPending} expectedErrorCode={query.expectedErrorCode} />
    </li>
  );
}
