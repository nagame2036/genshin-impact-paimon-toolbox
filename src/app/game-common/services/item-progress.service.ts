import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {NgxIndexedDBService} from 'ngx-indexed-db';
import {NGXLogger} from 'ngx-logger';
import {Item} from '../models/item.model';
import {map} from 'rxjs/operators';

export abstract class ItemProgressService<T extends Item<T>> {
  readonly progresses = new Map<number, T['progress']>();

  readonly ready = new ReplaySubject(1);

  protected constructor(
    protected storeName: string,
    protected database: NgxIndexedDBService,
    protected logger: NGXLogger,
  ) {
    this.database.getAll(this.storeName).subscribe(progresses => {
      progresses.forEach(it => this.progresses.set(it.id, it));
      this.logger.info(`loaded all progressions`, progresses);
      this.ready.next();
      this.ready.complete();
    });
  }

  abstract create(info: T['info'], meta: Partial<T['progress']>): T['progress'];

  abstract getMaxLevel(info: T['info']): number;

  update(item: T): Observable<void> {
    return this.database.update(this.storeName, item.progress).pipe(
      map(_ => {
        this.progresses.set(item.progress.id, item.progress);
        this.logger.info(`updated progression`, item);
      }),
    );
  }

  removeAll(list: T[]): Observable<void> {
    const remove = list.map(it => this.database.delete(this.storeName, it.progress.id));
    return forkJoin(remove).pipe(
      map(_ => {
        list.forEach(it => this.progresses.delete(it.progress.id));
        this.logger.info(`removed progressions`, list);
      }),
    );
  }
}
