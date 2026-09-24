export type CsvRow = Record<string, string>;

/** Small deterministic RFC4180-style parser; fields remain strings so blanks are not coerced. */
export function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = []; let row: string[] = []; let cell = ""; let quoted = false;
  for (let i = 0; i < text.length; i++) { const c = text[i]; const next = text[i + 1];
    if (quoted) { if (c === '"' && next === '"') { cell += '"'; i++; } else if (c === '"') quoted = false; else cell += c; }
    else if (c === '"') quoted = true; else if (c === ",") { row.push(cell); cell = ""; } else if (c === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; } else cell += c;
  }
  if (quoted) throw new Error("Unterminated quoted CSV field");
  if (cell !== "" || row.length) { row.push(cell.replace(/\r$/, "")); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  if (headers.some((h) => !h)) throw new Error("CSV contains a blank header");
  return rows.slice(1).filter((r) => r.some((v) => v !== "")).map((r) => Object.fromEntries(headers.map((header, index) => [header, r[index] ?? ""])));
}
export function stableRowId(fileHash: string, rowNumber: number): string { return `${fileHash}:${rowNumber}`; }
