import ExcelJS from "exceljs";
import type { SourceFile } from "./ingest.js";
import type { SourceType } from "./types.js";

/** Reads a selected worksheet as CSV-equivalent raw strings. Values are never numerically coerced. */
export async function xlsxToSourceFile(input: { name: string; type: SourceType; content: Buffer; worksheet?: string }): Promise<SourceFile> {
  const workbook = new ExcelJS.Workbook(); const bytes = input.content.buffer.slice(input.content.byteOffset, input.content.byteOffset + input.content.byteLength) as ArrayBuffer; await workbook.xlsx.load(bytes);
  const worksheet = input.worksheet ? workbook.getWorksheet(input.worksheet) : workbook.worksheets[0];
  if (!worksheet) throw new Error("Workbook contains no readable worksheet");
  const csv = worksheet.getSheetValues().slice(1).map((row) => {
    const cells = Array.isArray(row) ? row.slice(1) : [];
    return cells.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",");
  }).join("\n");
  return { name: input.name, type: input.type, content: csv };
}
