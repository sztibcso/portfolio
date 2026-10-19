import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PlaygroundHeader from "../features/sql-playground/components/PlaygroundHeader";
import DbStatusBanner from "../features/sql-playground/components/DbStatusBanner";
import ErDiagram from "../features/sql-playground/components/ErDiagram";
import DesignDecisions from "../features/sql-playground/components/DesignDecisions";
import QueryCard from "../features/sql-playground/components/QueryCard";
import TryItYourself from "../features/sql-playground/components/TryItYourself";
import SqlEditor from "../features/sql-playground/components/SqlEditor";
import CodeBlock from "../features/sql-playground/components/CodeBlock";
import { useDbStatus } from "../features/sql-playground/hooks/useDbStatus";
import { ER_DIAGRAM, SCHEMA_SQL } from "../features/sql-playground/data/schema";
import { GALLERY_QUERIES } from "../features/sql-playground/data/queries";
import { EDITOR_STARTER_SQL } from "../features/sql-playground/data/content";

const prose = "font-vt text-xl md:text-2xl leading-snug text-white/85";

/**
 * Normal document scrolling on purpose (no fullpage wrapper): the editor,
 * wide tables and long results need it.
 */
export default function SqlPlayground() {
  const [diagramSettled, setDiagramSettled] = useState(false);
  const db = useDbStatus(diagramSettled);
  // Stable so ErDiagram does not re-render Mermaid on every page render.
  const handleDiagramSettled = useCallback(() => setDiagramSettled(true), []);
  const [editorSql, setEditorSql] = useState(EDITOR_STARTER_SQL);
  const editorRef = useRef(/** @type {HTMLTextAreaElement | null} */ (null));

  /** @param {string} sql */
  function openInEditor(sql) {
    setEditorSql(sql);
    const editor = editorRef.current;
    if (!editor) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    editor.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    editor.focus({ preventScroll: true });
  }

  return (
    <div className="relative min-h-screen bg-black text-white">
      <GridBackground />
      <PlaygroundHeader />

      <main className="relative z-10 mx-auto max-w-5xl space-y-16 px-4 pb-28 pt-24 md:px-8">
        <section id="intro" aria-labelledby="intro-title" className="scroll-mt-24 space-y-5">
          <h1 id="intro-title" className="text-center font-pixel text-2xl md:text-5xl drop-shadow-lg">
            SQL Playground
          </h1>
          <p className={`${prose} text-center`}>
            A ticketing database for concerts across three Hungarian venues: data modelling, primary and foreign
            keys, constraints and joins. It is real PostgreSQL compiled to WebAssembly, running entirely in your
            browser with no server behind it, so every query below actually executes.
          </p>
          <DbStatusBanner {...db} onRetry={db.retry} />
        </section>

        <Section id="er-diagram" title="Data model">
          <p className={prose}>Eight tables, their keys and cardinalities.</p>
          <ErDiagram source={ER_DIAGRAM} onSettled={handleDiagramSettled} />
        </Section>

        <Section id="design" title="Design decisions">
          <DesignDecisions />
        </Section>

        <Section id="gallery" title="Query gallery">
          <p className={prose}>
            Each query runs against the same live database as the editor. The last three are designed to fail: the
            constraints stop them.
          </p>
          <ul className="space-y-8">
            {GALLERY_QUERIES.map((query) => (
              <QueryCard key={query.id} query={query} dbState={db.state} onOpenInEditor={openInEditor} />
            ))}
          </ul>
        </Section>

        <Section id="editor" title="Write your own SQL">
          <TryItYourself onOpenInEditor={openInEditor} />
          <SqlEditor sql={editorSql} onSqlChange={setEditorSql} dbState={db.state} textareaRef={editorRef} />
        </Section>

        <Section id="schema" title="Full schema">
          <details className="group rounded-xl border-2 border-white/20 bg-black/60 p-4 md:p-5">
            <summary className="cursor-pointer font-vt text-xl md:text-2xl text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Show the complete DDL
            </summary>
            <div className="mt-4">
              <CodeBlock code={SCHEMA_SQL} label="Complete database schema" />
            </div>
          </details>
        </Section>
      </main>

      <Link
        to="/"
        className="fixed bottom-6 right-6 z-50 rounded-full border-2 border-blue-400 bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-[2px_2px_0_0_rgba(255,255,255,0.2)] transition-all hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ← Portfolio
      </Link>
    </div>
  );
}

/**
 * @param {{ id: string, title: string, children: import("react").ReactNode }} props
 */
function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-5">
      <h2 id={`${id}-title`} className="font-pixel text-xl md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 opacity-5"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}
