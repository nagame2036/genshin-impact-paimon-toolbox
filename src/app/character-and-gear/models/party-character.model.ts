import {Character} from './character.model';
import {Ascension} from './ascension.enum';
import {TalentLevelData} from './talent-level-data.model';
import {Constellation} from './constellation.type';

export interface PartyCharacter extends Character {

  ascension: Ascension;

  level: number;

  constellation: Constellation;

  talents: TalentLevelData[];
}
