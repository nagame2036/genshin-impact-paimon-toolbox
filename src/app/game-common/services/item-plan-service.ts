import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Item, ItemInfo, ItemPlan, ItemProgress} from '../models/item.model';
import {map, tap} from 'rxjs/operators';
import {ItemType, itemTypeNames} from '../models/item-type.enum';
import {MaterialService} from '../../material/services/material.service';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {RequireDetail} from '../../material/models/requirement-detail.model';

export abstract class ItemPlanService<T> {
  protected abstract type: ItemType;

  readonly plans = new Map<number, ItemPlan<T>>();

  readonly ready = new ReplaySubject(1);

  protected constructor(
    protected storeName: string,
    protected materials: MaterialService,
    protected database: NgxIndexedDBService,
    protected logger: NGXLogger,
  ) {
    this.database.getAll(this.storeName).subscribe(plans => {
      plans.forEach(it => this.plans.set(it.id, it));
      this.logger.info(`fetched ${this.typeName} plans`, plans);
      this.ready.next();
      this.ready.complete();
    });
  }

  get typeName(): string {
    return itemTypeNames[this.type];
  }

  abstract create(info: ItemInfo<T>, id: number): ItemProgress<T>;

  getRequireDetails(item: Item<T>): Observable<RequireDetail[]> {
    return this.materials
      .getRequireDetails(this.type, item.plan.id, this.getRequireLabels(item))
      .pipe(tap(_ => this.logger.info('sent require detail', item)));
  }

  update(item: Item<T>): Observable<void> {
    const plan = item.plan;
    return this.database.update(this.storeName, plan).pipe(
      map(_ => {
        this.plans.set(plan.id, plan);
        this.updateRequire(item);
        this.logger.info(`updated ${this.typeName} plan`, item);
      }),
    );
  }

  updateRequire(item: Item<T>): void {
    const req = new MaterialRequireList(this.getRequirements(item));
    this.materials.updateRequire(this.type, item.plan.id, req);
  }

  removeAll(list: Item<T>[]): Observable<void> {
    const remove = list.map(it =>
      this.database.delete(this.storeName, it.plan.id),
    );
    return forkJoin(remove).pipe(
      map(_ => {
        list.forEach(it => this.plans.delete(it.plan.id));
        this.materials.removeAllRequire(this.type, list);
        this.logger.info(`removed ${this.typeName} plans`, list);
      }),
    );
  }

  protected abstract getRequirements(item: Item<T>): MaterialRequireList[];

  protected abstract getRequireLabels(item: Item<T>): string[];
}
