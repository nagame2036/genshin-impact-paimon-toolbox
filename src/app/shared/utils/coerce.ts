export function coerceAtLeast(value: number, atLeast: number): number {
  return Math.max(atLeast, value);
}

export function coerceIn(value: number, start: number, end: number): number {
  return Math.max(start, Math.min(end, value));
}
