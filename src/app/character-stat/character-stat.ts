import {StatField} from './stat-field';
import {FormControl} from '@angular/forms';
import {CharacterStatProfile} from './character-stat-profile';
import {Level} from '../shared/ascension-level-select/level';

function render(control: FormControl, value: number): void {
  control.setValue(value.toFixed(1));
}

export class CharacterStat {

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

  profile = new CharacterStatProfile();

  copyTarget!: CharacterStat;

  constructor(public label: string, private level: Level, private dmgType: FormControl, public copyLabel: string) {
  }

  calc(): void {
    const baseAtk = this.baseAtk.value;
    const plumeAtk = this.plumeAtk.value;
    const bonusAtk = this.bonusAtk.value;
    const critRate = this.critRate.value / 100;
    const critDmgBonus = this.critDmgBonus.value / 100;
    const elementalDmgBonus = this.elementalDmgBonus.value / 100;
    this.profile = new CharacterStatProfile(this.level, this.dmgType.value, baseAtk, plumeAtk, bonusAtk,
      critRate, critDmgBonus, elementalDmgBonus);

    render(this.baseDmg, this.profile.baseDmg);
    render(this.critDmg, this.profile.critDmg);
    render(this.meanDmg, this.profile.meanDmg);
  }

  copyFromProfile(profile: CharacterStatProfile): void {
    this.profile = profile;
    this.baseAtk.control.setValue(profile.baseAtk);
    this.plumeAtk.control.setValue(profile.plumeAtk);
    this.bonusAtk.control.setValue(Math.round(profile.bonusAtk * 10) / 10);
    this.critRate.control.setValue(Math.round(profile.critRate * 1000) / 10);
    this.critDmgBonus.control.setValue(Math.round(profile.critDmgBonus * 1000) / 10);
    this.elementalDmgBonus.control.setValue(Math.round(profile.elementalDmgBonus * 1000) / 10);
    render(this.baseDmg, profile.baseDmg);
    render(this.critDmg, profile.critDmg);
    render(this.meanDmg, profile.meanDmg);
  }

  copy(): void {
    this.copyTarget.copyFromProfile(this.profile);
  }
}
