const SECTIONS = Object.freeze([
  { id: "er-diagram", label: "Model" },
  { id: "design", label: "Decisions" },
  { id: "gallery", label: "Queries" },
  { id: "editor", label: "Editor" },
  { id: "schema", label: "Schema" },
]);

/** Fixed header matching the /tecnomatix case-study header. */
export default function PlaygroundHeader() {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between gap-4 border-b-2 border-white/20 bg-black/80 px-4 py-3 backdrop-blur-md md:px-6">
      <img src="/images/stLogo.png" alt="Tibcsó logo" className="h-10 transition-transform duration-300 hover:scale-105" />

      <nav aria-label="Page sections" className="hidden md:block">
        <ul className="flex items-center gap-5 font-vt text-xl">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-white/70 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <span className="rounded border-2 border-white px-3 py-1 font-vt text-lg font-bold tracking-[0.2em] text-white md:text-2xl">
        SQL PLAYGROUND
      </span>
    </header>
  );
}
