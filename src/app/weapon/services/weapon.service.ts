import {Injectable} from '@angular/core';
import {Weapon, WeaponOverview} from '../models/weapon.model';
import {WeaponInfo} from '../models/weapon-info.model';
import {WeaponInfoService} from './weapon-info.service';
import {WeaponProgressService} from './weapon-progress.service';
import {WeaponPlanner} from './weapon-planner.service';
import {MaterialService} from '../../material/services/material.service';
import {NGXLogger} from 'ngx-logger';
import {generateItemId} from '../../game-common/utils/generate-id';
import {RefineRank} from '../models/weapon-progress.model';
import {SafeHtml} from '@angular/platform-browser';
import {AscendableItemService} from '../../game-common/services/ascendable-item.service';

@Injectable({
  providedIn: 'root',
})
export class WeaponService extends AscendableItemService<Weapon, WeaponOverview> {
  constructor(
    private infos: WeaponInfoService,
    private progresses: WeaponProgressService,
    private planner: WeaponPlanner,
    private materials: MaterialService,
    logger: NGXLogger,
  ) {
    super(infos, progresses, planner, logger);
  }

  create(info: WeaponInfo): WeaponOverview {
    const meta = {id: generateItemId(this.type)};
    return this.createItem(info, meta);
  }

  getAbilityDesc(info: WeaponInfo, ...refines: RefineRank[]): SafeHtml {
    return this.infos.getAbilityDesc(info, refines);
  }

  protected initItems(): void {
    const infos = this.infos.infos;
    const plans = this.planner.plans;
    for (const [id, progress] of this.progresses.progresses) {
      const [info, plan] = [infos.get(progress.infoId), plans.get(id)];
      if (info && plan) {
        this.items.set(id, {info, progress, plan});
      }
    }
  }
}
