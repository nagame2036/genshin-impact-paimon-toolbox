import {Level} from '../shared/ascension-level-select/level';
import {DamageType} from './character-stat-profile/damage-type';
import {coerceIn} from '../shared/utils/coerce';

export class CharacterStatProfile {

  private baseAtkField = 0;

  private plumeAtkField = 0;

  private bonusAtkField = 0;

  private critRateField = 0.05;

  private critDmgBonusField = 0.5;

  private elementalDmgBonusField = 0;

  constructor(public level: Level = new Level(), public dmgType: DamageType = DamageType.PYRO,
              baseAtk: number = 0, plumeAtk: number = 0, bonusAtk: number = 0,
              critRate: number = 0.05, critDmgBonus: number = 0.5, elementalDmgBonus: number = 0) {
    this.baseAtk = baseAtk;
    this.plumeAtk = plumeAtk;
    this.bonusAtk = bonusAtk;
    this.critRate = critRate;
    this.critDmgBonus = critDmgBonus;
    this.elementalDmgBonus = elementalDmgBonus;
  }

  get baseAtk(): number {
    return this.baseAtkField;
  }

  set baseAtk(value: number) {
    this.baseAtkField = Math.max(0, value);
  }

  get plumeAtk(): number {
    return this.plumeAtkField;
  }

  set plumeAtk(value: number) {
    this.plumeAtkField = Math.max(0, value);
  }

  get bonusAtk(): number {
    return this.bonusAtkField;
  }

  set bonusAtk(value: number) {
    this.bonusAtkField = Math.max(0, value);
  }

  get critRate(): number {
    return this.critRateField;
  }

  set critRate(value: number) {
    this.critRateField = coerceIn(value, 0, 1);
  }

  get critDmgBonus(): number {
    return this.critDmgBonusField;
  }

  set critDmgBonus(value: number) {
    this.critDmgBonusField = Math.max(0, value);
  }

  get elementalDmgBonus(): number {
    return this.elementalDmgBonusField;
  }

  set elementalDmgBonus(value: number) {
    this.elementalDmgBonusField = Math.max(0, value);
  }

  get atk(): number {
    return this.baseAtk + this.bonusAtk;
  }

  get baseDmg(): number {
    return this.atk * (1 + this.elementalDmgBonus);
  }

  get critDmg(): number {
    return this.baseDmg * (1 + this.critDmgBonus);
  }

  get meanDmg(): number {
    return this.baseDmg * (1 + this.critRate * this.critDmgBonus);
  }

  copy(): CharacterStatProfile {
    return new CharacterStatProfile(this.level, this.dmgType, this.baseAtk, this.plumeAtk, this.bonusAtk,
      this.critRate, this.critDmgBonus, this.elementalDmgBonus);
  }
}
