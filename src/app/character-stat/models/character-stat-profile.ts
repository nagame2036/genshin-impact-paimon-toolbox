import {Level} from '../../shared/models/level';
import {DamageType} from './damage-type';
import {coerceIn} from '../../shared/utils/coerce';

export class CharacterStatProfile {

  private baseAtk$ = 0;

  private plumeAtk$ = 0;

  private bonusAtk$ = 0;

  private critRate$ = 0.05;

  private critDmgBonus$ = 0.5;

  private elementalDmgBonus$ = 0;

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
    return this.baseAtk$;
  }

  set baseAtk(value: number) {
    this.baseAtk$ = Math.max(0, value);
  }

  get plumeAtk(): number {
    return this.plumeAtk$;
  }

  set plumeAtk(value: number) {
    this.plumeAtk$ = Math.max(0, value);
  }

  get bonusAtk(): number {
    return this.bonusAtk$;
  }

  set bonusAtk(value: number) {
    this.bonusAtk$ = Math.max(this.plumeAtk, value);
  }

  get critRate(): number {
    return this.critRate$;
  }

  set critRate(value: number) {
    this.critRate$ = coerceIn(value, 0, 1);
  }

  get critDmgBonus(): number {
    return this.critDmgBonus$;
  }

  set critDmgBonus(value: number) {
    this.critDmgBonus$ = Math.max(0, value);
  }

  get elementalDmgBonus(): number {
    return this.elementalDmgBonus$;
  }

  set elementalDmgBonus(value: number) {
    this.elementalDmgBonus$ = Math.max(0, value);
  }

  get atk(): number {
    return this.baseAtk + Math.max(this.bonusAtk, this.plumeAtk);
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
