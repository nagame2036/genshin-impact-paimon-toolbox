import {CharacterStat} from './character-stat';
import {CharacterStatCompareField} from './character-stat-compare-field';

export class CharacterStatComparer {

  baseAtk = new CharacterStatCompareField('NaN', this.current.baseAtk.control, this.comparedBy.baseAtk.control);

  plumeAtk = new CharacterStatCompareField('NaN', this.current.plumeAtk.control, this.comparedBy.plumeAtk.control);

  bonusAtk = new CharacterStatCompareField('NaN', this.current.bonusAtk.control, this.comparedBy.bonusAtk.control);

  critRate = new CharacterStatCompareField('0.00', this.current.critRate.control, this.comparedBy.critRate.control);

  critDmgPct = new CharacterStatCompareField('0.00', this.current.critDmgBonus.control, this.comparedBy.critDmgBonus.control);

  bonusDmgPct = new CharacterStatCompareField('NaN', this.current.elementalDmgBonus.control, this.comparedBy.elementalDmgBonus.control);

  noCritDmg = new CharacterStatCompareField('NaN', this.current.baseDmg, this.comparedBy.baseDmg);

  critDmg = new CharacterStatCompareField('NaN', this.current.critDmg, this.comparedBy.critDmg);

  avgDmg = new CharacterStatCompareField('NaN', this.current.avgDmg, this.comparedBy.avgDmg);

  fields = [
    this.baseAtk,
    this.plumeAtk,
    this.bonusAtk,
    this.critRate,
    this.critDmgPct,
    this.bonusDmgPct,
    this.noCritDmg,
    this.critDmg,
    this.avgDmg
  ];

  constructor(private current: CharacterStat, private comparedBy: CharacterStat) {
  }

  calc(): void {
    this.fields.forEach(i => i.render());
  }
}
