import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {WeaponInfo} from '../models/weapon-info.model';
import {WeaponInfoService} from './weapon-info.service';
import {WeaponProgressService} from './weapon-progress.service';
import {WeaponPlanner} from './weapon-planner.service';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {map} from 'rxjs/operators';
import {ItemType} from '../../game-common/models/item-type.enum';
import {StatsType} from '../../game-common/models/stats.model';
import {generateItemId} from '../../game-common/utils/generate-id';
import {MaterialDetail} from '../../material/models/material.model';
import {CharacterStatsValue} from '../../character/models/character-stats.model';
import {allAscensions} from '../../game-common/models/ascension.type';
import {maxItemLevel} from '../../game-common/models/level.type';
import {RefineRank, WeaponProgress} from '../models/weapon-progress.model';
import {ItemService} from '../../game-common/services/item.service';
import {WeaponPlan} from '../models/weapon-plan.model';

@Injectable({
  providedIn: 'root',
})
export class WeaponService extends ItemService<Weapon> {
  protected type = ItemType.WEAPON;

  readonly infos = [...this.information.infos.values()];

  constructor(
    private information: WeaponInfoService,
    private progresses: WeaponProgressService,
    private planner: WeaponPlanner,
    private materials: MaterialService,
    logger: NGXLogger,
  ) {
    super(progresses, planner, logger);
  }

  create(info: WeaponInfo): WeaponOverview {
    const id = generateItemId(this.type);
    const meta = {id};
    const weapon = this.createItem(info, meta) as Weapon;
    return this.information.getOverview(weapon);
  }

  get(id: number): Observable<Weapon> {
    return this.doGet(id).pipe(map(it => it as Weapon));
  }

  getRequireMaterials(weapon: WeaponInfo): MaterialDetail[] {
    return this.information.getRequireMaterials(weapon);
  }

  getOverview(weapon: Weapon): WeaponOverview {
    return this.information.getOverview(weapon);
  }

  getStatsAtMaxLevel(weapon: WeaponInfo): CharacterStatsValue {
    const ascension = allAscensions[allAscensions.length - 1];
    const level = {ascension, level: maxItemLevel};
    return this.information.getStatsValue(weapon, level);
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
      map(_ => {
        const items = [...this.items.values()];
        return items.map(it => this.getOverview(it as Weapon));
      }),
    );
  }

  protected initItems(): void {
    const items = this.items;
    const infos = this.information.infos;
    const plans = this.planner.plans;
    for (const [id, p] of this.progresses.progresses) {
      const progress = p as WeaponProgress;
      const [info, plan] = [infos.get(progress.weaponId), plans.get(id)];
      if (info && plan) {
        items.set(id, {info, progress, plan: plan as WeaponPlan});
      }
    }
  }

  protected doGetStatsTypes(id: number): StatsType[] {
    const info = this.information.infos.get(id);
    if (!info) {
      return [];
    }
    return this.getStatsAtMaxLevel(info).getTypes();
  }
}
