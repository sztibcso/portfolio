import { useEffect, useId, useRef, useState } from "react";
import CodeBlock from "./CodeBlock";

const THEME_VARIABLES = Object.freeze({
  darkMode: true,
  background: "#000000",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: "15px",
  primaryColor: "#171717",
  primaryTextColor: "#ffffff",
  primaryBorderColor: "#ef4444",
  secondaryColor: "#0a0a0a",
  tertiaryColor: "#0a0a0a",
  lineColor: "#a3a3a3",
  textColor: "#e5e5e5",
  attributeBackgroundColorOdd: "#0a0a0a",
  attributeBackgroundColorEven: "#171717",
});

/**
 * Renders the Mermaid erDiagram; Mermaid is downloaded only when this mounts.
 * Falls back to the Mermaid source if rendering fails.
 * @param {{ source: string, onSettled?: () => void }} props `onSettled` fires once drawn or
 *   failed; pass a stable function, since a new one re-renders the diagram.
 */
export default function ErDiagram({ source, onSettled }) {
  const containerRef = useRef(null);
  const renderId = "er-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [state, setState] = useState(/** @type {"loading" | "ready" | "error"} */ ("loading"));

  // Rendering into a DOM node owned by Mermaid is external-system synchronisation.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: THEME_VARIABLES,
          er: { useMaxWidth: true },
        });
        const { svg } = await mermaid.render(renderId, source);
        if (cancelled || !containerRef.current) return;
        // Static, first-party source rendered with securityLevel "strict".
        containerRef.current.innerHTML = svg;
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
      if (!cancelled) onSettled?.();
    })();
    return () => {
      cancelled = true;
    };
  }, [renderId, source, onSettled]);

  if (state === "error") {
    return (
      <div className="space-y-2">
        <p className="font-mono text-sm md:text-base text-white/70">
          The diagram could not be drawn, so here is its Mermaid source:
        </p>
        <CodeBlock code={source} label="Mermaid ER diagram source" />
      </div>
    );
  }

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Entity-relationship diagram (scrollable)"
      className="overflow-x-auto rounded-lg border-2 border-white/15 bg-black p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      {state === "loading" && <p className="font-mono text-sm text-white/60">Drawing diagram…</p>}
      <div ref={containerRef} className="min-w-[640px] [&_svg]:mx-auto" />
    </div>
  );
}
