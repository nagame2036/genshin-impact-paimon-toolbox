import {Injectable} from '@angular/core';
import {EMPTY, forkJoin, Observable, of, ReplaySubject, zip} from 'rxjs';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {WeaponInfo} from '../models/weapon-info.model';
import {WeaponInfoService} from './weapon-info.service';
import {WeaponProgressService} from './weapon-progress.service';
import {WeaponPlanner} from './weapon-planner.service';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {
  defaultIfEmpty,
  first,
  map,
  mergeMap,
  switchMap,
  tap,
  throwIfEmpty,
} from 'rxjs/operators';
import {ItemType} from '../../game-common/models/item-type.enum';
import {StatsType} from '../../game-common/models/stats.model';
import {RequireDetail} from '../../material/models/requirement-detail.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponService {
  private readonly weapons$ = new ReplaySubject<Map<number, Weapon>>(1);

  readonly weapons = this.weapons$.asObservable();

  readonly infos = this.information.infos.pipe(
    map(infos => [...infos.values()]),
  );

  constructor(
    private information: WeaponInfoService,
    private progressor: WeaponProgressService,
    private planner: WeaponPlanner,
    private materials: MaterialService,
    private logger: NGXLogger,
  ) {
    zip(this.information.infos, this.progressor.inProgress, this.planner.plans)
      .pipe(
        first(),
        map(([infos, inProgress, plans]) => {
          const weapons = new Map<number, Weapon>();
          for (const [id, progress] of inProgress) {
            const [info, plan] = [infos.get(progress.weaponId), plans.get(id)];
            if (info && plan) {
              weapons.set(id, {info, progress, plan});
            }
          }
          this.logger.info('loaded weapons', weapons);
          this.weapons$.next(weapons);
          return weapons;
        }),
        switchMap(weapons => {
          const requirementObs = [...weapons.values()].map(weapon => {
            return this.planner.updateRequire(weapon);
          });
          return forkJoin(requirementObs);
        }),
      )
      .subscribe(_ => {
        this.logger.info('loaded the requirements of all weapons');
      });
  }

  create(info: WeaponInfo): Observable<WeaponOverview> {
    const id = new Date().getTime() * 100 + ItemType.WEAPON;
    const progress = this.progressor.create(info, id);
    const plan = this.planner.create(info, id);
    const weapon = {info, progress, plan};
    return this.information.getOverview(weapon);
  }

  get(id: number): Observable<Weapon> {
    return this.weapons.pipe(
      switchMap(weapons => {
        const weapon = weapons.get(id);
        return weapon ? of(weapon) : EMPTY;
      }),
      throwIfEmpty(),
      tap(weapon => this.logger.info('sent weapon', weapon)),
    );
  }

  getRequireDetails(weapon: Weapon): Observable<RequireDetail[]> {
    return this.planner.getRequireDetails(weapon);
  }

  getOverview(weapon: Weapon): Observable<WeaponOverview> {
    return this.information.getOverview(weapon);
  }

  getStatsTypes(weapon: WeaponOverview): StatsType[] {
    const stats = weapon.currentStats;
    return stats.getTypes();
  }

  getAll(): Observable<WeaponOverview[]> {
    return this.weapons.pipe(
      mergeMap(weapons =>
        forkJoin([...weapons.values()].map(it => this.getOverview(it))),
      ),
      defaultIfEmpty([] as WeaponOverview[]),
      tap(weapons => this.logger.info('sent weapons', weapons)),
    );
  }

  update(weapon: Weapon): void {
    this.weapons
      .pipe(
        first(),
        map(weapons => {
          weapons.set(weapon.progress.id, weapon);
          this.weapons$.next(weapons);
        }),
        mergeMap(_ => this.progressor.update(weapon)),
        mergeMap(_ => this.planner.update(weapon)),
      )
      .subscribe(_ => this.logger.info('updated weapon', weapon));
  }

  remove(weapon: Weapon): void {
    this.weapons
      .pipe(
        first(),
        map(weapons => {
          weapons.delete(weapon.progress.id);
          this.weapons$.next(weapons);
        }),
        mergeMap(_ => this.progressor.remove(weapon)),
        mergeMap(_ => this.planner.remove(weapon)),
      )
      .subscribe(_ => this.logger.info('removed weapon', weapon));
  }

  removeAll(weaponList: Weapon[]): void {
    this.weapons
      .pipe(
        first(),
        map(weapons => {
          weaponList.forEach(weapon => weapons.delete(weapon.progress.id));
          this.weapons$.next(weapons);
        }),
        mergeMap(_ => this.progressor.removeAll(weaponList)),
        mergeMap(_ => this.planner.removeAll(weaponList)),
      )
      .subscribe(_ => this.logger.info('removed weapons', weaponList));
  }
}
