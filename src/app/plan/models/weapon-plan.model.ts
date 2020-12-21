import {LevelupPlan} from './levelup-plan.model';

export interface WeaponPlan {

  /**
   * Key of party weapon.
   */
  id: number;

  levelup: LevelupPlan;
}
