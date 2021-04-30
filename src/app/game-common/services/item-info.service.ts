import {Item} from '../models/item.model';
import {Observable, of} from 'rxjs';

export abstract class ItemInfoService<T extends Item<T>> {
  abstract readonly infos: Map<number, T['info']>;

  getIgnoredIds(): Observable<Set<number>> {
    return of(new Set());
  }

  abstract refresh(info: T['info'], progress: T['progress'], plan: T['plan']): T;
}
