export default function TableSlide({ slide }) {
  return (
    <div className="mt-8 space-y-6">
      {slide.text && (
        <p className="max-w-4xl mx-auto text-center text-white/75 text-lg leading-relaxed">
          {slide.text}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border-2 border-white/20 bg-black/60 shadow-[8px_8px_0_0_rgba(255,255,255,0.1)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-white/20">
              {slide.table.columns.map((column) => (
                <th key={column} className="p-4 text-red-400 text-xl font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {slide.table.rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-white/10">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="p-4 text-white/85 text-lg">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}