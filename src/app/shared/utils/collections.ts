import {iif, Observable, of} from 'rxjs';

export function toggleListItem<T>(list: T[], item: T, equals: (a: T) => boolean): T[] {
  const notFound = list.findIndex(it => equals(it)) === -1;
  const result = list.filter(it => !equals(it));
  if (notFound) {
    result.push(item);
  }
  return result;
}

export function toggleItem<T extends { id: number }>(list: T[], item: T, equals: (a: T) => boolean = a => a.id === item.id): T[] {
  return toggleListItem(list, item, equals);
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

export function findObservable<T>(list: T[], predicate: (item: T) => boolean): Observable<T> {
  const index = list.findIndex(predicate);
  return iif(() => index !== -1, of(list[index]));
}

export function mapArrays<T, K, V, R>(items: T[], map: Map<K, V>, key: (item: T) => K, result: (item: T, mapItem: V) => R): R[] {
  const results: R[] = [];
  for (const item of items) {
    const mapItem = map.get(key(item));
    if (mapItem) {
      results.push(result(item, mapItem));
    }
  }
  return results;
}
