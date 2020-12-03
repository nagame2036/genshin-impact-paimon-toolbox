export function rangeList(min: number, max: number): number[] {
  return Array.from({length: (max - min + 1)}, (v, k) => k + min);
}
