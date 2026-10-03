import { parseCsv, type CsvRow } from "./csv.js";
/** Deterministic tab-delimited adapter; preserves source strings and row order. */
export function parseTsv(text: string): CsvRow[] { return parseCsv(text.replace(/\t/g, ",")); }
