import {NGXLogger} from 'ngx-logger';
import {combineLatest, forkJoin, Observable, of, ReplaySubject, throwError, zip} from 'rxjs';
import {Item} from '../models/item.model';
import {switchMap} from 'rxjs/operators';
import {ItemProgressService} from './item-progress.service';
import {ItemPlanService} from './item-plan.service';
import {RequireDetail} from '../../material/models/requirement-detail.model';
import {ItemType} from '../models/item-type.type';
import {ItemInfoService} from './item-info.service';

export abstract class ItemService<T extends Item<T>, TO extends T, TC = TO> {
  type: ItemType;

  protected readonly items = new Map<number, T>();

  protected readonly infosInArray = [...this.infos$.infos.values()];

  protected readonly infosAddable$ = new ReplaySubject<T['info'][]>(1);

  readonly infosAddable = this.infosAddable$.asObservable();

  protected readonly itemsInProgress$ = new ReplaySubject<TO[]>(1);

  readonly itemsInProgress = this.itemsInProgress$.asObservable();

  protected updated = new ReplaySubject(1);

  protected constructor(
    private infos$: ItemInfoService<T, TO>,
    private progresses$: ItemProgressService<T>,
    private planner$: ItemPlanService<T>,
    protected logger: NGXLogger,
  ) {
    this.type = planner$.type;
    zip(progresses$.ready, planner$.ready).subscribe(_ => {
      this.initItems();
      this.items.forEach(it => this.planner$.updateRequire(it));
      this.logger.info(`loaded all items`, this.items);
      this.updated.next();
    });
    combineLatest([infos$.getIgnoredIds(), this.updated]).subscribe(([ignored]) => {
      const items = [...this.items.values()]
        .filter(it => !ignored.has(it.info.id))
        .map(it => this.getOverview(it));
      this.itemsInProgress$.next(items);
      this.infosAddable$.next(this.getAddableInfos(ignored));
    });
  }

  getMaxLevel(info: T['info']): number {
    return this.progresses$.getMaxLevel(info);
  }

  abstract create(info: T['info']): TC;

  get(id: number): Observable<T> {
    return this.updated.pipe(
      switchMap(_ => {
        const item = this.items.get(id);
        return item ? of(item) : throwError('item-not-found');
      }),
    );
  }

  getOverview(item: T): TO {
    return this.infos$.getOverview(item);
  }

  getRequireDetails(item: T): Observable<RequireDetail[]> {
    return this.planner$.getRequireDetails(item);
  }

  update(item: T): void {
    const items = this.getItemsNeedUpdate(item);
    const subActions = items.flatMap(it => [this.progresses$.update(it), this.planner$.update(it)]);
    forkJoin(subActions).subscribe(_ => {
      this.logger.info(`updated items`, items);
      items.forEach(it => this.items.set(it.progress.id, it));
      this.updated.next();
    });
  }

  removeAll(list: T[]): void {
    const items = this.getItemsNeedRemove(list);
    const subActions = [this.progresses$.removeAll(items), this.planner$.removeAll(items)];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info(`removed items`, items);
      items.forEach(item => this.items.delete(item.progress.id));
      this.updated.next();
    });
  }

  protected abstract initItems(): void;

  protected createItem(info: T['info'], meta: Partial<T['progress']>): TO {
    const progress = this.progresses$.create(info, meta);
    const plan = this.planner$.create(info, meta);
    return this.getOverview({info, progress, plan} as T);
  }

  protected getAddableInfos(ignoreIds: Set<number>): T['info'][] {
    return this.infosInArray;
  }

  protected getItemsNeedUpdate(item: T): T[] {
    return [item];
  }

  protected getItemsNeedRemove(items: T[]): T[] {
    return items;
  }
}
