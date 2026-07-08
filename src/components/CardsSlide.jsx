export default function CardsSlide({ slide }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
      {slide.cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-black/60 p-6 rounded-xl border-2 border-white/20 shadow-[6px_6px_0_0_rgba(255,255,255,0.1)]"
        >
          <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-3">
            {card.title}
          </h2>
          <p className="text-white/80 leading-relaxed text-lg">{card.text}</p>
        </div>
      ))}
    </div>
  );
}