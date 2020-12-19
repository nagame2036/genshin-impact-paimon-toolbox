import {Character} from './character';
import {Ascension} from './ascension.enum';
import {TalentLevelData} from './talent-level-data.model';
import {Constellation} from './constellation';

export interface PartyCharacter extends Character {

  ascension: Ascension;

  level: number;

  constellation: Constellation;

  talents: TalentLevelData[];
}
