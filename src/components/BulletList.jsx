export default function BulletList({ bullets }) {
  return (
    <div className="bg-black/60 p-6 md:p-8 rounded-xl border-2 border-white/20 shadow-[8px_8px_0_0_rgba(255,255,255,0.1)]">
      <ul className="space-y-4">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-4">
            <span className="text-red-400 font-bold mt-1 shrink-0 text-xl">
              ▶
            </span>
            <span className="text-base md:text-xl leading-relaxed">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}