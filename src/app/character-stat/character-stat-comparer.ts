import {CharacterStat} from './character-stat';
import {CharacterStatChange} from './character-stat-change';

export class CharacterStatComparer {

  baseAtk = new CharacterStatChange('NaN', this.current.baseAtk.control, this.comparedBy.baseAtk.control);

  plumeAtk = new CharacterStatChange('NaN', this.current.plumeAtk.control, this.comparedBy.plumeAtk.control);

  bonusAtk = new CharacterStatChange('NaN', this.current.bonusAtk.control, this.comparedBy.bonusAtk.control);

  critRate = new CharacterStatChange('0.0', this.current.critRate.control, this.comparedBy.critRate.control);

  critDmgBonus = new CharacterStatChange('0.0', this.current.critDmgBonus.control, this.comparedBy.critDmgBonus.control);

  elementalDmgBonus = new CharacterStatChange('NaN', this.current.elementalDmgBonus.control, this.comparedBy.elementalDmgBonus.control);

  noCritDmg = new CharacterStatChange('NaN', this.current.baseDmg, this.comparedBy.baseDmg);

  critDmg = new CharacterStatChange('NaN', this.current.critDmg, this.comparedBy.critDmg);

  meanDmg = new CharacterStatChange('NaN', this.current.meanDmg, this.comparedBy.meanDmg);

  fields = [
    this.baseAtk,
    this.plumeAtk,
    this.bonusAtk,
    this.critRate,
    this.critDmgBonus,
    this.elementalDmgBonus,
    this.noCritDmg,
    this.critDmg,
    this.meanDmg
  ];

  constructor(private current: CharacterStat, private comparedBy: CharacterStat) {
  }

  calc(): void {
    this.fields.forEach(i => i.render());
  }
}
