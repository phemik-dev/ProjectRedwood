import type { Cents } from "./types.js";

export function parseMoney(value: string | undefined): Cents | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const normalized = value.trim();
  const negative = /^\(.*\)$/.test(normalized) || normalized.startsWith("-");
  const bare = normalized.replace(/[,$()\s]/g, "").replace(/^-/, "");
  if (!/^\d+(\.\d{1,2})?$/.test(bare)) throw new Error(`Invalid monetary value: ${value}`);
  const [whole, fraction = ""] = bare.split(".");
  const cents = BigInt(whole) * 100n + BigInt((fraction + "00").slice(0, 2));
  return negative ? -cents : cents;
}
export function money(value: Cents): string { const sign = value < 0n ? "-" : ""; const absolute = value < 0n ? -value : value; return `${sign}$${(absolute / 100n).toLocaleString()}.${(absolute % 100n).toString().padStart(2, "0")}`; }
export function sum(values: Iterable<Cents | undefined>): Cents { let total = 0n; for (const value of values) if (value !== undefined) total += value; return total; }
export function centsToNumber(value: Cents): number { return Number(value) / 100; }
