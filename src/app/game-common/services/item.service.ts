import {NGXLogger} from 'ngx-logger';
import {forkJoin, Observable, of, ReplaySubject, throwError, zip} from 'rxjs';
import {Item, ItemInfo} from '../models/item.model';
import {switchMap} from 'rxjs/operators';
import {StatsType} from '../models/stats.model';
import {ItemProgressService} from './item-progress.service';
import {ItemPlanService} from './item-plan.service';
import {RequireDetail} from '../../material/models/requirement-detail.model';
import {ItemType, itemTypeNames} from '../models/item-type.enum';

export abstract class ItemService<T extends Item<any>> {
  protected abstract type: ItemType;

  private statsTypeCache = new Map<number, StatsType[]>();

  readonly items = new Map<number, Item<T>>();

  protected updated = new ReplaySubject(1);

  protected constructor(
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

  get typeName(): string {
    return itemTypeNames[this.type];
  }

  getStatsTypes(id: number): StatsType[] {
    const existing = this.statsTypeCache.get(id);
    if (existing) {
      return existing;
    }
    const types = this.doGetStatsTypes(id);
    this.statsTypeCache.set(id, types);
    return types;
  }

  getRequireDetails(item: Item<T>): Observable<RequireDetail[]> {
    return this.planService.getRequireDetails(item);
  }

  update(item: Item<T>): void {
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

  removeAll(list: Item<T>[]): void {
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

  protected createItem(info: ItemInfo<T>, meta: Partial<T['progress']>): Item<T> {
    const progress = this.progressService.create(info, meta);
    const plan = this.planService.create(info, meta);
    return {info, progress, plan};
  }

  protected doGet(id: number): Observable<Item<T>> {
    return this.updated.pipe(
      switchMap(_ => {
        const item = this.items.get(id);
        return item ? of(item) : throwError('item-not-found');
      }),
    );
  }

  protected abstract doGetStatsTypes(id: number): StatsType[];

  protected getItemsNeedUpdate(item: Item<T>): Item<T>[] {
    return [item];
  }

  protected getItemsNeedRemove(items: Item<T>[]): Item<T>[] {
    return items;
  }
}
