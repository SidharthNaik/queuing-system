/** Injection token for the time source, so tests can control "now". */
export const CLOCK = Symbol('CLOCK');

export type Clock = () => Date;

/** Formats a date as YYYY-MM-DD in the server's local time zone. */
export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
