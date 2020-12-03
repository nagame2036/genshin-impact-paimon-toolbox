import {Level} from '../shared/ascension-level-select/level';
import {DamageType} from './character-stat-profile/damage-type';

export class CharacterStatProfile {

  atk = 0;

  baseDmg = 0;

  critDmg = 0;

  avgDmg = 0;

  constructor(public level: Level = new Level(), public dmgType: DamageType = DamageType.PYRO,
              public baseAtk: number = 0, public plumeAtk: number = 0, public bonusAtk: number = 0,
              public critRate: number = 0.05, public critDmgBonus: number = 0.5, public elementalDmgBonus: number = 0) {
    this.atk = baseAtk + bonusAtk;
    const atk = this.atk;
    this.baseDmg = atk * elementalDmgBonus;
    this.critDmg = this.baseDmg * (1 + critDmgBonus);
    this.avgDmg = this.baseDmg * (1 + critRate * critDmgBonus);
  }
}
