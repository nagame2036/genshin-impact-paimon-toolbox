import {NGXLogger} from 'ngx-logger';
import {combineLatest, forkJoin, Observable, of, ReplaySubject, throwError, zip} from 'rxjs';
import {Item} from '../models/item.model';
import {map, switchMap} from 'rxjs/operators';
import {StatsType} from '../models/stats.model';
import {ItemProgressService} from './item-progress.service';
import {ItemPlanService} from './item-plan.service';
import {RequireDetail} from '../../material/models/requirement-detail.model';
import {ItemType, itemTypeNames} from '../models/item-type.enum';

export abstract class ItemService<T extends Item<T>, TO extends T> {
  private typeName = itemTypeNames[this.type];

  protected readonly items = new Map<number, T>();

  protected updated = new ReplaySubject(1);

  private statsTypeCache = new Map<number, StatsType[]>();

  protected constructor(
    protected type: ItemType,
    private progressService: ItemProgressService<T>,
    private planService: ItemPlanService<T>,
    protected logger: NGXLogger,
  ) {
    zip(this.progressService.ready, this.planService.ready).subscribe(_ => {
      this.initItems();
      this.items.forEach(it => this.planService.updateRequire(it));
      this.logger.info(`loaded all ${this.typeName}`, this.items);
      this.updated.next();
    });
  }

  abstract getOverview(item: T): TO;

  get(id: number): Observable<T> {
    return this.updated.pipe(
      switchMap(_ => {
        const item = this.items.get(id);
        return item ? of(item) : throwError('item-not-found');
      }),
    );
  }

  getAll(): Observable<TO[]> {
    return combineLatest([this.getIgnoredIds(), this.updated]).pipe(
      map(([ids]) => {
        return [...this.items.values()]
          .filter(it => !ids.has(it.info.id))
          .map(it => this.getOverview(it));
      }),
    );
  }

  getStatsTypes(id: number): StatsType[] {
    const existing = this.statsTypeCache.get(id);
    if (existing) {
      return existing;
    }
    const types = this.calcStatsTypes(id);
    this.statsTypeCache.set(id, types);
    return types;
  }

  getRequireDetails(item: T): Observable<RequireDetail[]> {
    return this.planService.getRequireDetails(item);
  }

  update(item: T): void {
    const items = this.getItemsNeedUpdate(item);
    const subActions = [];
    for (const it of items) {
      subActions.push(this.progressService.update(it));
      subActions.push(this.planService.update(it));
    }
    forkJoin(subActions).subscribe(_ => {
      this.logger.info(`updated ${this.typeName}`, items);
      items.forEach(it => this.items.set(it.progress.id, it));
      this.updated.next();
    });
  }

  removeAll(list: T[]): void {
    const items = this.getItemsNeedRemove(list);
    const subActions = [
      this.progressService.removeAll(items),
      this.planService.removeAll(items),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info(`removed ${this.typeName}`, items);
      items.forEach(item => this.items.delete(item.progress.id));
      this.updated.next();
    });
  }

  protected abstract initItems(): void;

  protected createItem(info: T['info'], meta: Partial<T['progress']>): TO {
    const progress = this.progressService.create(info, meta);
    const plan = this.planService.create(info, meta);
    return this.getOverview({info, progress, plan} as T);
  }

  protected getIgnoredIds(): Observable<Set<number>> {
    return of(new Set());
  }

  protected calcStatsTypes(id: number): StatsType[] {
    return [];
  }

  protected getItemsNeedUpdate(item: T): T[] {
    return [item];
  }

  protected getItemsNeedRemove(items: T[]): T[] {
    return items;
  }
}
