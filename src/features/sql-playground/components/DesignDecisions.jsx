import CodeBlock from "./CodeBlock";
import { DESIGN_DECISIONS } from "../data/content";

export default function DesignDecisions() {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {DESIGN_DECISIONS.map((decision) => (
        <li key={decision.id} className="flex min-w-0 flex-col gap-3 rounded-xl border-2 border-white/20 bg-black/60 p-4 md:p-5 shadow-[6px_6px_0_0_rgba(255,255,255,0.08)]">
          <h3 className="font-vt text-2xl md:text-3xl text-red-400">{decision.title}</h3>
          <p className="font-vt text-xl md:text-2xl leading-snug text-white/85">{decision.explanation}</p>
          <div className="mt-auto">
            <CodeBlock code={decision.sql} label={`SQL for ${decision.title}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
