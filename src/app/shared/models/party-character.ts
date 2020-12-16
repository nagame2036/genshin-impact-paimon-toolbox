import {Character} from './character';
import {Ascension} from './ascension.enum';
import {TalentLevel} from './talent-level';
import {Constellation} from './constellation';

export interface PartyCharacter extends Character {

  ascension: Ascension;

  level: number;

  constellation: Constellation;

  talents: TalentLevel[];
}
