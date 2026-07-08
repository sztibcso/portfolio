export default function ComparisonSlide({ slide }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {slide.cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-black/60 rounded-xl p-6 border-2 border-white/20 shadow-[6px_6px_0_0_rgba(255,255,255,0.1)]"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-5">
            {card.title}
          </h2>

          <div className="space-y-3 text-lg">
            <p>
              <span className="text-white/50">Before:</span>{" "}
              <span className="font-bold">{card.before}</span>
            </p>
            <p>
              <span className="text-white/50">After:</span>{" "}
              <span className="font-bold">{card.after}</span>
            </p>
            <p className="pt-4 text-white border-t border-white/20">
              {card.result}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}