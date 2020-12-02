import {FormControl} from '@angular/forms';
import {CharacterStatField} from './character-stat-field';
import {CharacterStat} from './character-stat';

export class CharacterStatComparer {

  baseAtk = new FormControl('NaN');

  bonusAtk = new FormControl('NaN');

  critRate = new FormControl('0.00');

  critDmgPct = new FormControl('0.00');

  bonusDmgPct = new FormControl('NaN');

  talentDmgPct = new FormControl('NaN');

  noCritDmg = new FormControl('NaN');

  critDmg = new FormControl('NaN');

  avgDmg = new FormControl('NaN');

  fields = [
    this.baseAtk,
    this.bonusAtk,
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

  private static renderField(current: CharacterStatField, comparedBy: CharacterStatField): string {
    return this.render(comparedBy.value, current.value);
  }

  private static renderText(current: FormControl, comparedBy: FormControl): string {
    return this.render(comparedBy.value, current.value);
  }

  private static render(comparedBy: number, current: number): string {
    return ((comparedBy / current - 1) * 100).toFixed(2);
  }

  calc(): void {
    const current = this.current;
    const comparedBy = this.comparedBy;
    this.baseAtk.setValue(CharacterStatComparer.renderField(current.baseAtk, comparedBy.baseAtk));
    this.bonusAtk.setValue(CharacterStatComparer.renderField(current.bonusAtk, comparedBy.bonusAtk));
    this.critRate.setValue(CharacterStatComparer.renderField(current.critRate, comparedBy.critRate));
    this.critDmgPct.setValue(CharacterStatComparer.renderField(current.critDmgPct, comparedBy.critDmgPct));
    this.bonusDmgPct.setValue(CharacterStatComparer.renderField(current.bonusDmgPct, comparedBy.bonusDmgPct));
    this.talentDmgPct.setValue(CharacterStatComparer.renderField(current.talentDmgPct, comparedBy.talentDmgPct));
    this.noCritDmg.setValue(CharacterStatComparer.renderText(current.noCritDmg, comparedBy.noCritDmg));
    this.critDmg.setValue(CharacterStatComparer.renderText(current.critDmg, comparedBy.critDmg));
    this.avgDmg.setValue(CharacterStatComparer.renderText(current.avgDmg, comparedBy.avgDmg));
  }
}
