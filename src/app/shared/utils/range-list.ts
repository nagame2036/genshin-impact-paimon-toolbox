export function rangeList<T extends number>(min: T, max: T): T[] {
  return Array.from({length: max - min + 1}, (_, i) => max - i) as T[];
}
