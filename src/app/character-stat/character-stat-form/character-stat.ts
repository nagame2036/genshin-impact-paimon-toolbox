import {CharacterStatField} from './character-stat-field';
import {FormControl} from '@angular/forms';

export class CharacterStat {

  baseAtk = new CharacterStatField();

  bonusAtk = new CharacterStatField();

  critRate = new CharacterStatField({min: 5, max: 100, suffix: '%'});

  critDmgPct = new CharacterStatField({min: 50, suffix: '%'});

  bonusDmgPct = new CharacterStatField({min: 0, suffix: '%'});

  talentDmgPct = new CharacterStatField({min: 0, suffix: '%'});

  fields = [
    this.baseAtk,
    this.bonusAtk,
    this.critRate,
    this.critDmgPct,
    this.bonusDmgPct,
    this.talentDmgPct
  ];

  fieldLabels = [
    'base-atk',
    'bonus-atk',
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

  calc(): void {
    const totalAtk = this.baseAtk.value + this.bonusAtk.value;
    const critRate = this.critRate.value / 100;
    const critDmgPct = 1 + this.critDmgPct.value / 100;
    const critBonusDmg = 1 + critRate * critDmgPct;
    const bonusDmgPct = 1 + this.bonusDmgPct.value / 100;
    const talentDmgPct = this.talentDmgPct.value / 100;

    const noCritDmg = totalAtk * bonusDmgPct * talentDmgPct;
    this.noCritDmg.setValue(noCritDmg.toFixed(2));
    const critDmg = totalAtk * critDmgPct * bonusDmgPct * talentDmgPct;
    this.critDmg.setValue(critDmg.toFixed(2));
    const avgDmg = totalAtk * critBonusDmg * bonusDmgPct * talentDmgPct;
    this.avgDmg.setValue(avgDmg.toFixed(2));
  }
}
