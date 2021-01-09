import {iif, Observable, of} from 'rxjs';

export function toggleItem<T extends { id: number }>(list: T[], item: T, equals: (a: T) => boolean = a => a.id === item.id): T[] {
  const notFound = list.findIndex(it => equals(it)) === -1;
  const result = list.filter(it => !equals(it));
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

export function findObservable<T>(list: T[], predicate: (item: T) => boolean): Observable<T> {
  const index = list.findIndex(predicate);
  return iif(() => index !== -1, of(list[index]));
}
