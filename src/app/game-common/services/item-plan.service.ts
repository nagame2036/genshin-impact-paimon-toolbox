import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Item} from '../models/item.model';
import {map, tap} from 'rxjs/operators';
import {ItemType} from '../models/item-type.type';
import {MaterialService} from '../../material/services/material.service';
import {MaterialRequireList} from '../../material/collections/material-require-list';
import {RequireDetail} from '../../material/models/requirement-detail.model';

export abstract class ItemPlanService<T extends Item<T>> {
  abstract readonly type: ItemType;

  readonly plans = new Map<number, T['plan']>();

  readonly ready = new ReplaySubject(1);

  protected constructor(
    protected storeName: string,
    protected materials: MaterialService,
    protected database: NgxIndexedDBService,
    protected logger: NGXLogger,
  ) {
    this.database.getAll(this.storeName).subscribe(plans => {
      plans.forEach(it => this.plans.set(it.id, it));
      this.logger.info(`loaded all plans`, plans);
      this.ready.next();
      this.ready.complete();
    });
  }

  abstract create(info: T['info'], meta: Partial<T['progress']>): T['plan'];

  getRequireDetails(item: T): Observable<RequireDetail[]> {
    return this.materials
      .getRequireDetails(this.type, item.plan.id, this.getRequireLabels(item))
      .pipe(tap(_ => this.logger.info('sent require detail', item)));
  }

  update(item: T): Observable<void> {
    const plan = item.plan;
    return this.database.update(this.storeName, plan).pipe(
      map(_ => {
        this.plans.set(plan.id, plan);
        this.updateRequire(item);
        this.logger.info(`updated plan`, item);
      }),
    );
  }

  updateRequire(item: T): void {
    this.materials.updateRequire(this.type, item.plan.id, this.getRequirements(item));
  }

  removeAll(list: T[]): Observable<void> {
    const remove = list.map(it => this.database.delete(this.storeName, it.plan.id));
    return forkJoin(remove).pipe(
      map(_ => {
        list.forEach(it => this.plans.delete(it.plan.id));
        this.materials.removeAllRequire(this.type, list);
        this.logger.info(`removed plans`, list);
      }),
    );
  }

  protected abstract getRequirements(item: T): MaterialRequireList[];

  protected abstract getRequireLabels(item: T): string[];
}
