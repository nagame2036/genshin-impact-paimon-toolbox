import {Level} from '../shared/ascension-level-select/level';
import {DamageType} from './character-stat-profile/damage-type';

export class CharacterStatProfile {

  constructor(public level: Level = new Level(), public dmgType: DamageType = DamageType.PYRO,
              public baseAtk: number = 0, public plumeAtk: number = 0, public bonusAtk: number = 0,
              public critRate: number = 0.05, public critDmgBonus: number = 0.5, public elementalDmgBonus: number = 0) {
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
    return Object.assign({}, this);
  }
}
