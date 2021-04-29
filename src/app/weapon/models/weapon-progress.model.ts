import {Ascension} from '../../game-common/models/ascension.type';
import {ItemProgress} from '../../game-common/models/item.model';
import {Weapon} from './weapon.model';

/**
 * Represents the levelup progress of a weapon.
 */
export interface WeaponProgress extends ItemProgress<Weapon> {
  id: number;

  infoId: number;

  refine: RefineRank;

  ascension: Ascension;

  level: number;
}

export const allRefineRanks = [1, 2, 3, 4, 5] as const;

export type RefineRank = typeof allRefineRanks[number];
