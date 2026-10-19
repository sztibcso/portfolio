import { useEffect, useRef, useState } from "react";

/**
 * Read-only SQL. It becomes a Tab stop only while its content overflows
 * horizontally, so keyboard users can scroll long lines without short
 * snippets adding extra stops.
 * @param {{ code: string, label?: string }} props
 */
export default function CodeBlock({ code, label = "SQL code" }) {
  const preRef = useRef(/** @type {HTMLPreElement | null} */ (null));
  const [overflows, setOverflows] = useState(false);

  // Measuring layout is DOM synchronisation; re-checked whenever the box resizes.
  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return undefined;
    const measure = () => setOverflows(pre.scrollWidth > pre.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pre);
    return () => observer.disconnect();
  }, [code]);

  return (
    <pre
      ref={preRef}
      tabIndex={overflows ? 0 : undefined}
      role="region"
      aria-label={label}
      className="overflow-x-auto rounded-lg border-2 border-white/15 bg-neutral-950 p-3 md:p-4 font-mono text-sm md:text-base leading-relaxed text-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      <code>{code}</code>
    </pre>
  );
}
