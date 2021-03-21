export function coerceIn<T extends number>(value: T, start: T, end: T): T {
  return Math.max(start, Math.min(end, value)) as T;
}

export function coerceRange<T extends number>(value: T, range: [T, T]): T {
  return coerceIn(value, range[0], range[1]);
}
