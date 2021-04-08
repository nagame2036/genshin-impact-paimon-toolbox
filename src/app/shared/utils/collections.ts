export function toggleItem<T>(list: T[], item: T, equals: (a: T) => boolean): T[] {
  const notFound = list.findIndex(it => equals(it)) === -1;
  const result = list.filter(it => !equals(it));
  if (notFound) {
    result.push(item);
  }
  return result;
}

export function unionMap<T>(items: T[][]): Map<T, T[]> {
  const map = new Map<T, T[]>();
  for (const list of items) {
    for (const item of list) {
      map.set(item, list);
    }
  }
  return map;
}
