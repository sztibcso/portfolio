export default function MetricsGrid({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-white text-black rounded-xl p-4 border-4 border-white shadow-[4px_4px_0_0_rgba(255,255,255,0.3)]"
        >
          <p className="text-xs uppercase tracking-widest text-black/60">
            {metric.label}
          </p>
          <p className="text-3xl font-bold text-red-600">{metric.value}</p>
          <p className="text-xs text-black/70">{metric.suffix}</p>
        </div>
      ))}
    </div>
  );
}