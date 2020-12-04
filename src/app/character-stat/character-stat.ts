import {StatField} from './stat-field';
import {FormControl} from '@angular/forms';
import {CharacterStatProfile} from './character-stat-profile';
import {Level} from '../shared/ascension-level-select/level';
import {DamageType} from './character-stat-profile/damage-type';

function render(control: FormControl, value: number): void {
  control.setValue(value.toFixed(1));
}

export class CharacterStat {

  constructor(public label: string) {
  }

  baseAtk = new StatField();

  plumeAtk = new StatField({min: 0, max: 311});

  bonusAtk = new StatField();

  critRate = new StatField({min: 5, max: 100, suffix: '%'});

  critDmgBonus = new StatField({min: 50, suffix: '%'});

  elementalDmgBonus = new StatField({min: 0, suffix: '%'});

  fields = [
    this.baseAtk,
    this.plumeAtk,
    this.bonusAtk,
    this.critRate,
    this.critDmgBonus
  ];

  labels = [
    'base-atk',
    'plume-atk',
    'bonus-atk',
    'crit-rate',
    'crit-dmg-bonus'
  ];

  baseDmg = new FormControl('0.0');

  critDmg = new FormControl('0.0');

  meanDmg = new FormControl('0.0');

  dmgFields = [
    this.baseDmg,
    this.critDmg,
    this.meanDmg
  ];

  dmgLabels = [
    'no-crit-dmg',
    'crit-dmg',
    'mean-dmg'
  ];

  calc(characterLevel: Level, dmgType: DamageType): CharacterStatProfile {
    const baseAtk = this.baseAtk.value;
    const plumeAtk = this.plumeAtk.value;
    const bonusAtk = this.bonusAtk.value;
    const critRate = this.critRate.value / 100;
    const critDmgBonus = this.critDmgBonus.value / 100;
    const elementalDmgBonus = 1 + this.elementalDmgBonus.value / 100;
    const profile = new CharacterStatProfile(characterLevel, dmgType, baseAtk, plumeAtk, bonusAtk,
      critRate, critDmgBonus, elementalDmgBonus);

    render(this.baseDmg, profile.baseDmg);
    render(this.critDmg, profile.critDmg);
    render(this.meanDmg, profile.meanDmg);
    return profile;
  }
}
