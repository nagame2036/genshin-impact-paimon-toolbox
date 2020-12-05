export function fixValue(value: number, precision: number): number {
  const p = Math.round(precision);
  const helper = Math.pow(10, p);
  return Math.round(value * helper) / helper;
}
