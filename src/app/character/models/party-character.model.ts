import {Character} from './character.model';
import {Ascension} from '../../game-common/models/ascension.type';
import {TalentLevelData} from './talent-level-data.model';
import {Constellation} from './constellation.type';

export interface PartyCharacter extends Character {

  ascension: Ascension;

  level: number;

  constellation: Constellation;

  /**
   * Talent id and its level.
   */
  talents: TalentLevelData[];
}
