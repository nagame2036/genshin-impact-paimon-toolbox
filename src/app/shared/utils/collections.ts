export function toggleItem(list: { id: number }[], item: { id: number }): any[] {
  const notFound = list.findIndex(it => it.id === item.id) === -1;
  const result = list.filter(it => it.id !== item.id);
  if (notFound) {
    result.push(item);
  }
  return result;
}

export function partitionArrays<T>(list: T[], conditions: ((item: T) => boolean)[]): T[][] {
  const result = Array.from(new Array(conditions.length + 1), () => new Array<T>());
  foreach:
    for (const item of list) {
      for (let i = 0; i < conditions.length; i++) {
        if (conditions[i](item)) {
          result[i].push(item);
          continue foreach;
        }
      }
      result[conditions.length].push(item);
    }
  return result;
}

export function ensureAtLeastOneElement<T>(current: T[], changed: T[]): T[] {
  return changed.length > 0 ? changed : [...current];
}
