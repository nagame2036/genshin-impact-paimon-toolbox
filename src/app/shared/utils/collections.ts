import {isNumeric} from 'rxjs/internal-compatibility';

export function toggleListItem<T>(list: T[], item: T, equals: (a: T) => boolean): T[] {
  const notFound = list.findIndex(it => equals(it)) === -1;
  const result = list.filter(it => !equals(it));
  if (notFound) {
    result.push(item);
  }
  return result;
}

export function objectMap<T extends { id: number }>(obj: { [id: number]: T }): Map<number, T> {
  const result = new Map<number, any>();
  for (const [key, value] of Object.entries(obj)) {
    const newKey = isNumeric(key) ? Number(key) : key;
    value.id = newKey;
    result.set(newKey, value);
  }
  return result;
}

export function mapArrays<T, K, V, R>(items: T[], map: Map<K, V>, key: (item: T) => K, result: (item: T, mapItem: V) => R): R[] {
  const results = [];
  for (const item of items) {
    const mapItem = map.get(key(item));
    if (mapItem) {
      results.push(result(item, mapItem));
    }
  }
  return results;
}
