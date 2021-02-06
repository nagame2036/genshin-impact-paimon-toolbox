import {WeaponInfo} from './weapon-info.model';
import {WeaponProgress} from './weapon-progress.model';
import {WeaponPlan} from './weapon-plan.model';
import {WeaponStatsValue} from './weapon-stats.model';

/**
 * Represents the details of a weapon.
 */
export interface Weapon {

  info: WeaponInfo;

  progress: WeaponProgress;

  plan: WeaponPlan;
}

export interface WeaponWithStats extends Weapon {

  currentStats: WeaponStatsValue;

  planStats: WeaponStatsValue;
}
