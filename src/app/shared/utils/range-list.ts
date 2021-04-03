export function rangeList<T extends number>(
  min: T,
  max: T,
  step: number = 1,
): T[] {
  const length = (max - min) / step + 1;
  return Array.from({length}, (_, i) => max - i * step) as T[];
}
