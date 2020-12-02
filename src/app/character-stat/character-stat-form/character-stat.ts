import {CharacterStatField} from './character-stat-field';
import {FormControl} from '@angular/forms';

export class CharacterStat {

  baseAtk = new CharacterStatField();

  plumeAtk = new CharacterStatField({min: 0, max: 311});

  bonusAtk = new CharacterStatField();

  atkFields = [
    this.baseAtk,
    this.plumeAtk,
    this.bonusAtk
  ];

  atkFieldLabels = [
    'base-atk',
    'plume-atk',
    'bonus-atk'
  ];

  atkIncPct = new FormControl('NaN');

  atk = new FormControl('0.00');

  critRate = new CharacterStatField({min: 5, max: 100, suffix: '%'});

  critDmgPct = new CharacterStatField({min: 50, suffix: '%'});

  bonusDmgPct = new CharacterStatField({min: 0, suffix: '%'});

  talentDmgPct = new CharacterStatField({min: 0, suffix: '%'});

  effectFields = [
    this.critRate,
    this.critDmgPct,
    this.bonusDmgPct,
    this.talentDmgPct
  ];

  effectFieldLabels = [
    'crit-rate',
    'crit-dmg-pct',
    'bonus-dmg-pct',
    'talent-dmg-pct'
  ];

  noCritDmg = new FormControl('0.00');

  critDmg = new FormControl('0.00');

  avgDmg = new FormControl('0.00');

  damages = [
    this.noCritDmg,
    this.critDmg,
    this.avgDmg
  ];

  damageLabels = [
    'no-crit-dmg',
    'crit-dmg',
    'avg-dmg'
  ];

  private fractionDigits = 2;

  calc(): void {
    const bonusAtk = this.bonusAtk.value;
    const baseAtk = this.baseAtk.value;
    const atkIncPct = (bonusAtk - this.plumeAtk.value) / baseAtk * 100;
    this.atkIncPct.setValue(atkIncPct.toFixed(this.fractionDigits));
    const atk = baseAtk + bonusAtk;
    this.atk.setValue(atk.toFixed(this.fractionDigits));

    const critRate = this.critRate.value / 100;
    const critDmgPct = 1 + this.critDmgPct.value / 100;
    const critBonusDmg = 1 + critRate * critDmgPct;
    const bonusDmgPct = 1 + this.bonusDmgPct.value / 100;
    const talentDmgPct = this.talentDmgPct.value / 100;

    const noCritDmg = atk * bonusDmgPct * talentDmgPct;
    this.noCritDmg.setValue(noCritDmg.toFixed(this.fractionDigits));
    const critDmg = atk * critDmgPct * bonusDmgPct * talentDmgPct;
    this.critDmg.setValue(critDmg.toFixed(this.fractionDigits));
    const avgDmg = atk * critBonusDmg * bonusDmgPct * talentDmgPct;
    this.avgDmg.setValue(avgDmg.toFixed(this.fractionDigits));
  }
}
