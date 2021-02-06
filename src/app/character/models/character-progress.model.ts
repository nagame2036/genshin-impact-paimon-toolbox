import {Ascension} from '../../game-common/models/ascension.type';
import {TalentProgress} from './talent-progress.model';

/**
 * Represents the levelup progress of a character.
 */
export interface CharacterProgress {

  id: number;

  constellation: Constellation;

  ascension: Ascension;

  level: number;

  talents: TalentProgress;
}

export type Constellation = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const allConstellations: Constellation[] = [0, 1, 2, 3, 4, 5, 6];
