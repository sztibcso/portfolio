import { formatCell } from "../lib/resultFormat";

/**
 * @param {{ fields: string[], rows: unknown[][] }} props
 */
export default function ResultTable({ fields, rows }) {
  return (
    <div className="overflow-x-auto max-h-[28rem] overflow-y-auto rounded-lg border-2 border-white/20">
      <table className="min-w-full border-collapse font-mono text-sm md:text-base text-left">
        <thead className="sticky top-0 bg-neutral-900">
          <tr>
            {/* Columns and rows have no identity of their own; a new result replaces the whole table. */}
            {fields.map((name, i) => (
              <th
                key={i}
                scope="col"
                className="px-3 py-2 border-b-2 border-white/20 text-red-400 font-semibold whitespace-nowrap"
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="odd:bg-white/[0.03]">
              {row.map((value, c) => {
                const text = formatCell(value);
                return (
                  <td key={c} className="px-3 py-1.5 border-b border-white/10 whitespace-nowrap align-top">
                    {text === null ? (
                      <span className="text-xs italic text-white/45 border border-white/25 rounded px-1">
                        NULL
                      </span>
                    ) : (
                      text
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
