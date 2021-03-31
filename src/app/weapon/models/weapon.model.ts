import {WeaponInfo} from './weapon-info.model';
import {WeaponProgress} from './weapon-progress.model';
import {WeaponPlan} from './weapon-plan.model';
import {WeaponStatsValue} from './weapon-stats.model';
import {Item} from '../../game-common/models/item.model';

/**
 * Represents the details of a weapon.
 */
export interface Weapon extends Item<Weapon> {
  info: WeaponInfo;

  progress: WeaponProgress;

  plan: WeaponPlan;
}

export interface WeaponOverview extends Weapon {
  currentStats: WeaponStatsValue;

  planStats: WeaponStatsValue;
}
