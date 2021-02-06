import {WeaponInfo} from './weapon-info.model';
import {WeaponProgress} from './weapon-progress.model';
import {WeaponPlan} from './weapon-plan.model';

/**
 * Represents the details of a weapon.
 */
export interface Weapon {

  info: WeaponInfo;

  progress: WeaponProgress;

  plan: WeaponPlan;
}
