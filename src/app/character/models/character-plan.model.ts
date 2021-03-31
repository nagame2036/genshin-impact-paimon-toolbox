import {Ascension} from '../../game-common/models/ascension.type';
import {TalentProgress} from './talent-progress.model';
import {ItemPlan} from '../../game-common/models/item.model';
import {Character} from './character.model';

/**
 * Represents the levelup goal of a character.
 */
export interface CharacterPlan extends ItemPlan<Character> {
  ascension: Ascension;

  level: number;

  talents: TalentProgress;
}
