import {Ascension} from '../../game-common/models/ascension.type';

/**
 * Represents the levelup progress of a weapon.
 */
export interface WeaponProgress {
  id: number;

  weaponId: number;

  refine: RefineRank;

  ascension: Ascension;

  level: number;
}

export type RefineRank = 1 | 2 | 3 | 4 | 5;

export const allRefineRanks: RefineRank[] = [1, 2, 3, 4, 5];
