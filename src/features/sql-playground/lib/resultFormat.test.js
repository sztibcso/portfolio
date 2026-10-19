import {
  MAX_DISPLAY_ROWS,
  formatCell,
  limitRows,
  summarizeResult,
} from "./resultFormat";

describe("limitRows", () => {
  it("keeps short results untouched", () => {
    const rows = [[1], [2]];
    expect(limitRows(rows)).toEqual({ rows, total: 2, truncated: false });
  });

  it("caps long results at MAX_DISPLAY_ROWS", () => {
    const rows = Array.from({ length: 250 }, (_, i) => [i]);
    const limited = limitRows(rows);
    expect(limited.rows).toHaveLength(MAX_DISPLAY_ROWS);
    expect(limited.total).toBe(250);
    expect(limited.truncated).toBe(true);
  });
});

describe("formatCell", () => {
  it("returns null for SQL NULL", () => {
    expect(formatCell(null)).toBeNull();
    expect(formatCell(undefined)).toBeNull();
  });

  it("keeps empty strings distinct from NULL", () => {
    expect(formatCell("")).toBe("");
  });

  it("formats scalars, JSON and bytea", () => {
    expect(formatCell(42)).toBe("42");
    expect(formatCell(false)).toBe("false");
    expect(formatCell(10n)).toBe("10");
    expect(formatCell({ a: [1, 2] })).toBe('{"a":[1,2]}');
    expect(formatCell(new Uint8Array([0, 255]))).toBe("\\x00ff");
  });
});

describe("summarizeResult", () => {
  it("reports truncated row counts", () => {
    const rows = Array.from({ length: 201 }, () => [1]);
    expect(summarizeResult({ ok: true, fields: ["n"], rows, durationMs: 12.4 })).toBe(
      "Showing first 200 of 201 rows (12 ms)"
    );
  });

  it("reports affected rows for statements without a result set", () => {
    expect(
      summarizeResult({ ok: true, fields: [], rows: [], affectedRows: 1, durationMs: 0.5 })
    ).toBe("Query OK, 1 row affected (0.5 ms)");
  });

  it("includes the SQLSTATE for errors", () => {
    expect(summarizeResult({ ok: false, message: "x", code: "23505", durationMs: 2 })).toBe(
      "Error 23505 after 2.0 ms"
    );
  });
});
