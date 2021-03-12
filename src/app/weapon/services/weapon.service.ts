import {Injectable} from '@angular/core';
import {forkJoin, Observable, of, ReplaySubject, throwError, zip} from 'rxjs';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {WeaponInfo} from '../models/weapon-info.model';
import {WeaponInfoService} from './weapon-info.service';
import {WeaponProgressService} from './weapon-progress.service';
import {WeaponPlanner} from './weapon-planner.service';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {map, switchMap, tap} from 'rxjs/operators';
import {ItemType} from '../../game-common/models/item-type.enum';
import {StatsType} from '../../game-common/models/stats.model';
import {RequireDetail} from '../../material/models/requirement-detail.model';
import {generateItemId} from '../../game-common/utils/generate-id';

@Injectable({
  providedIn: 'root',
})
export class WeaponService {
  private weapons = new Map<number, Weapon>();

  readonly infos = [...this.information.infos.values()];

  private statsTypeCache = new Map<number, StatsType[]>();

  private updated = new ReplaySubject(1);

  constructor(
    private information: WeaponInfoService,
    private progressor: WeaponProgressService,
    private planner: WeaponPlanner,
    private materials: MaterialService,
    private logger: NGXLogger,
  ) {
    zip(this.progressor.ready, this.planner.ready).subscribe(_ => {
      const weapons = this.weapons;
      const infos = this.information.infos;
      const inProgress = this.progressor.inProgress;
      const plans = this.planner.plans;
      for (const [id, progress] of inProgress) {
        const [info, plan] = [infos.get(progress.weaponId), plans.get(id)];
        if (info && plan) {
          weapons.set(id, {info, progress, plan});
        }
      }
      this.logger.info('loaded weapons', weapons);
      weapons.forEach(it => this.planner.updateRequire(it));
      this.logger.info('loaded the requirements of all weapons');
      this.updated.next();
    });
  }

  create(info: WeaponInfo): WeaponOverview {
    const id = generateItemId(ItemType.WEAPON);
    const progress = this.progressor.create(info, id);
    const plan = this.planner.create(info, id);
    const weapon = {info, progress, plan};
    return this.information.getOverview(weapon);
  }

  get(id: number): Observable<Weapon> {
    return this.updated.pipe(
      switchMap(_ => {
        const weapon = this.weapons.get(id);
        this.logger.info('sent weapon', weapon);
        return weapon ? of(weapon) : throwError('weapon-not-found');
      }),
    );
  }

  getRequireDetails(weapon: Weapon): Observable<RequireDetail[]> {
    return this.planner.getRequireDetails(weapon);
  }

  getOverview(weapon: Weapon): WeaponOverview {
    return this.information.getOverview(weapon);
  }

  getStatsTypes(weapon: WeaponOverview): StatsType[] {
    const id = weapon.info.id;
    const existing = this.statsTypeCache.get(id);
    if (existing) {
      return existing;
    }
    const result = weapon.currentStats.getTypes();
    this.statsTypeCache.set(id, result);
    return result;
  }

  getAll(): Observable<WeaponOverview[]> {
    return this.updated.pipe(
      map(_ => [...this.weapons.values()].map(it => this.getOverview(it))),
      tap(weapons => this.logger.info('sent weapons', weapons)),
    );
  }

  update(weapon: Weapon): void {
    this.weapons.set(weapon.progress.id, weapon);
    const subActions = [
      this.progressor.update(weapon),
      this.planner.update(weapon),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('updated weapon', weapon);
      this.updated.next();
    });
  }

  remove(weapon: Weapon): void {
    this.weapons.delete(weapon.progress.id);
    const subActions = [
      this.progressor.remove(weapon),
      this.planner.remove(weapon),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('removed weapon', weapon);
      this.updated.next();
    });
  }

  removeAll(list: Weapon[]): void {
    list.forEach(weapon => this.weapons.delete(weapon.progress.id));
    const subActions = [
      this.progressor.removeAll(list),
      this.planner.removeAll(list),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('removed weapons', list);
      this.updated.next();
    });
  }
}
