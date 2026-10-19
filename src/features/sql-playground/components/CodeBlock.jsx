/**
 * Read-only SQL. Focusable so keyboard users can scroll long lines.
 * @param {{ code: string, label?: string }} props
 */
export default function CodeBlock({ code, label = "SQL code" }) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="overflow-x-auto rounded-lg border-2 border-white/15 bg-neutral-950 p-3 md:p-4 font-mono text-sm md:text-base leading-relaxed text-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      <code>{code}</code>
    </pre>
  );
}
