export function rangeList(min: number, max: number, reserve: boolean = false): number[] {
  const length = max - min + 1;
  if (reserve) {
    return Array.from({length}, (_, i) => max - i);
  }
  return Array.from({length}, (_, i) => min + i);
}
