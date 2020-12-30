import {StatField} from './stat-field.model';
import {FormControl} from '@angular/forms';
import {CharacterStatProfile} from './character-stat-profile.model';
import {AscensionLevel} from '../../character-and-gear/models/ascension-level.model';

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
    this.critDmgBonus,
    this.elementalDmgBonus
  ];

  labels = [
    'base-atk',
    'plume-atk',
    'bonus-atk',
    'crit-rate',
    'crit-dmg-bonus',
    'elemental-dmg-bonus'
  ];

  profile!: CharacterStatProfile;

  get baseDmg(): number {
    return this.profile.baseDmg;
  }

  get critDmg(): number {
    return this.profile.critDmg;
  }

  get meanDmg(): number {
    return this.profile.meanDmg;
  }

  dmgFields = [
    () => this.baseDmg,
    () => this.critDmg,
    () => this.meanDmg
  ];

  dmgLabels = [
    'no-crit-dmg',
    'crit-dmg',
    'mean-dmg'
  ];

  copyTarget!: CharacterStat;

  constructor(public label: string, private level: AscensionLevel, private dmgType: FormControl, public copyLabel: string) {
  }

  calc(): void {
    const baseAtk = this.baseAtk.value;
    const plumeAtk = this.plumeAtk.value;
    const bonusAtk = this.bonusAtk.value;
    const critRate = this.critRate.value * .01;
    const critDmgBonus = this.critDmgBonus.value * .01;
    const elementalDmgBonus = this.elementalDmgBonus.value * .01;
    this.profile = new CharacterStatProfile(this.level, this.dmgType.value, baseAtk, plumeAtk, bonusAtk,
      critRate, critDmgBonus, elementalDmgBonus);
  }

  copyFromProfile(profile: CharacterStatProfile): void {
    this.profile = profile;
    this.baseAtk.value = profile.baseAtk;
    this.plumeAtk.value = profile.plumeAtk;
    this.bonusAtk.value = profile.bonusAtk;
    this.critRate.value = profile.critRate * 100;
    this.critDmgBonus.value = profile.critDmgBonus * 100;
    this.elementalDmgBonus.value = profile.elementalDmgBonus * 100;
  }

  copy(): void {
    this.copyTarget.copyFromProfile(this.profile);
  }
}
