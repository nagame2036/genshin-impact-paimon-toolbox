export function toggleItem<T>(list: T[], item: T, equals: (a: T) => boolean): T[] {
  if (list.findIndex(it => equals(it)) !== -1) {
    return list.filter(it => !equals(it));
  }
  list.push(item);
  return list;
}

export function unionMap<T>(items: T[][]): Map<T, T[]> {
  return new Map<T, T[]>(items.flatMap(list => list.map(item => [item, list])));
}
