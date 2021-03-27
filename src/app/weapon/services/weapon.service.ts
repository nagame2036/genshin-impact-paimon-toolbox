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
import {MaterialDetail} from '../../material/models/material.model';
import {CharacterStatsValue} from '../../character/models/character-stats.model';
import {allAscensions} from '../../game-common/models/ascension.type';
import {maxItemLevel} from '../../game-common/models/level.type';
import {RefineRank} from '../models/weapon-progress.model';

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

  getRequireMaterials(weapon: WeaponInfo): MaterialDetail[] {
    return this.information.getMaterials(weapon);
  }

  getRequireDetails(weapon: Weapon): Observable<RequireDetail[]> {
    return this.planner.getRequireDetails(weapon);
  }

  getOverview(weapon: Weapon): WeaponOverview {
    return this.information.getOverview(weapon);
  }

  getStatsAtMaxLevel(weapon: WeaponInfo): CharacterStatsValue {
    const ascension = allAscensions[allAscensions.length - 1];
    const level = {ascension, level: maxItemLevel};
    return this.information.getStatsValue(weapon, level);
  }

  getStatsTypes(weaponId: number): StatsType[] {
    const existing = this.statsTypeCache.get(weaponId);
    if (existing) {
      return existing;
    }
    const info = this.information.infos.get(weaponId);
    if (!info) {
      return [];
    }
    const types = this.getStatsAtMaxLevel(info).getTypes();
    this.statsTypeCache.set(weaponId, types);
    return types;
  }

  getAbilityDesc(
    weapon: WeaponInfo,
    refineStart: RefineRank,
    refineEnd: RefineRank = refineStart,
  ): string {
    return this.information.getAbilityDesc(weapon, refineStart, refineEnd);
  }

  getAll(): Observable<WeaponOverview[]> {
    return this.updated.pipe(
      map(_ => [...this.weapons.values()].map(it => this.getOverview(it))),
      tap(weapons => this.logger.info('sent weapons', weapons)),
    );
  }

  update(weapon: Weapon): void {
    const subActions = [
      this.progressor.update(weapon),
      this.planner.update(weapon),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('updated weapon', weapon);
      this.weapons.set(weapon.progress.id, weapon);
      this.updated.next();
    });
  }

  removeAll(list: Weapon[]): void {
    const subActions = [
      this.progressor.removeAll(list),
      this.planner.removeAll(list),
    ];
    forkJoin(subActions).subscribe(_ => {
      this.logger.info('removed weapons', list);
      list.forEach(weapon => this.weapons.delete(weapon.progress.id));
      this.updated.next();
    });
  }
}
