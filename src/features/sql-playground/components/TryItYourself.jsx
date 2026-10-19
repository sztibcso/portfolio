import { EXPERIMENTS } from "../data/content";

/**
 * @param {{ onOpenInEditor: (sql: string) => void }} props
 */
export default function TryItYourself({ onOpenInEditor }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-red-400/60 bg-red-950/20 p-4 md:p-5">
      <h3 className="font-pixel text-base md:text-lg text-red-300">Try it yourself</h3>
      <ol className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {EXPERIMENTS.map((experiment, index) => (
          <li key={experiment.id} className="flex flex-col gap-2">
            <p className="font-vt text-2xl md:text-3xl text-white">
              {index + 1}. {experiment.title}
            </p>
            <p className="font-vt text-xl md:text-2xl leading-snug text-white/80">{experiment.description}</p>
            <button
              type="button"
              onClick={() => onOpenInEditor(experiment.sql)}
              aria-label={`Open in editor: ${experiment.title}`}
              className="mt-auto self-start rounded-lg border-2 border-white/60 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Open in editor
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
