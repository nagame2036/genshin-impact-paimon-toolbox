import {Ascension} from '../../game-common/models/ascension.type';
import {TalentProgress} from './talent-progress.model';

/**
 * Represents the levelup goal of a character.
 */
export interface CharacterPlan {
  id: number;

  ascension: Ascension;

  level: number;

  talents: TalentProgress;
}
