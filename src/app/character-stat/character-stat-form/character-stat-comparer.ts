import {CharacterStat} from './character-stat';
import {CharacterStatCompareField} from './character-stat-compare-field';

export class CharacterStatComparer {

  baseAtk = new CharacterStatCompareField('NaN', this.current.baseAtk.control, this.comparedBy.baseAtk.control);

  plumeAtk = new CharacterStatCompareField('NaN', this.current.plumeAtk.control, this.comparedBy.plumeAtk.control);

  bonusAtk = new CharacterStatCompareField('NaN', this.current.bonusAtk.control, this.comparedBy.bonusAtk.control);

  atkIncPct = new CharacterStatCompareField('NaN', this.current.atkIncPct, this.comparedBy.atkIncPct);

  atk = new CharacterStatCompareField('NaN', this.current.atk, this.comparedBy.atk);

  critRate = new CharacterStatCompareField('0.00', this.current.critRate.control, this.comparedBy.critRate.control);

  critDmgPct = new CharacterStatCompareField('0.00', this.current.critDmgPct.control, this.comparedBy.critDmgPct.control);

  bonusDmgPct = new CharacterStatCompareField('NaN', this.current.bonusDmgPct.control, this.comparedBy.bonusDmgPct.control);

  talentDmgPct = new CharacterStatCompareField('NaN', this.current.talentDmgPct.control, this.comparedBy.talentDmgPct.control);

  noCritDmg = new CharacterStatCompareField('NaN', this.current.noCritDmg, this.comparedBy.noCritDmg);

  critDmg = new CharacterStatCompareField('NaN', this.current.critDmg, this.comparedBy.critDmg);

  avgDmg = new CharacterStatCompareField('NaN', this.current.avgDmg, this.comparedBy.avgDmg);

  fields = [
    this.baseAtk,
    this.plumeAtk,
    this.bonusAtk,
    this.atkIncPct,
    this.atk,
    this.critRate,
    this.critDmgPct,
    this.bonusDmgPct,
    this.talentDmgPct,
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
