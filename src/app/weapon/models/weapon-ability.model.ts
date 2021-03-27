import {p, v} from '../../game-common/utils/value-display';

export interface WeaponAbility {
  id: number;

  params: number[][];
}

interface WeaponAbilityData {
  desc: (params: number[]) => string[];
}

export const allWeaponAbilities: Record<number, WeaponAbilityData> = {
  11301: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  11302: {
    desc: ([chcBonus]) => [p(chcBonus)],
  },
  11303: {
    desc: ([hpRestore]) => [p(hpRestore)],
  },
  11304: {
    desc: ([atkBonus]) => [p(atkBonus)],
  },
  11305: {
    desc: ([, dmg, cd]) => [p(dmg), v(cd)],
  },
  11306: {
    desc: ([atkBonus]) => [p(atkBonus)],
  },
  11401: {
    desc: ([energyChance, cd]) => [p(energyChance), v(cd)],
  },
  11402: {
    desc: ([, dmg]) => [p(dmg)],
  },
  11403: {
    desc: ([resetCdChance, cd]) => [p(resetCdChance), v(cd)],
  },
  11404: {
    desc: ([chcBonus]) => [p(chcBonus)],
  },
  11405: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  11406: {
    desc: ([atkDefBonus]) => [p(atkDefBonus)],
  },
  11407: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  11408: {
    desc: ([atkBonus]) => [p(atkBonus)],
  },
  11409: {
    desc: ([dmgBonus, hpRestore]) => [p(dmgBonus), p(hpRestore)],
  },
  11410: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  11412: {
    desc: ([dmgChance, dmg, , atk]) => [p(dmgChance), p(dmg), v(atk)],
  },
  11413: {
    desc: ([dmgBonus, chcBonus]) => [p(dmgBonus), p(chcBonus)],
  },
  11501: {
    desc: ([atkBonus, hpRestore, dmg]) => [p(atkBonus), p(hpRestore), p(dmg)],
  },
  11502: {
    desc: ([chcBonus, moveSpdBonus, atkSpdBonus, dmg]) => [
      p(chcBonus),
      p(moveSpdBonus),
      p(atkSpdBonus),
      p(dmg),
    ],
  },
  11504: {
    desc: ([shieldStr, atkBonus]) => [p(shieldStr), p(atkBonus)],
  },
  11505: {
    desc: ([hpBonus, atkBonus]) => [p(hpBonus), p(atkBonus)],
  },
  12301: {
    desc: ([hpLt, dmgBonus]) => [p(hpLt), p(dmgBonus)],
  },
  12303: {
    desc: ([hpRestore]) => [p(hpRestore)],
  },
  12305: {
    desc: ([dmg]) => [p(dmg)],
  },
  12306: {
    desc: ([atkBonus]) => [p(atkBonus)],
  },
  12402: {
    desc: ([shield, cd, dmgBonus]) => [p(shield), v(cd), p(dmgBonus)],
  },
  12405: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  12406: {
    desc: ([, dmg]) => [p(dmg)],
  },
  12407: {
    desc: ([atkDefBonus]) => [p(atkDefBonus)],
  },
  12409: {
    desc: ([, dmgBonus, dmgNegBonus]) => [p(dmgBonus), p(dmgNegBonus)],
  },
  12410: {
    desc: ([atkBonus, chcBonus]) => [p(atkBonus), p(chcBonus)],
  },
  12411: {
    desc: ([dmgChance, dmg, dmgExtra]) => [p(dmgChance), p(dmg), p(dmgExtra)],
  },
  12501: {
    desc: ([dmgBonus, dmg]) => [p(dmgBonus), p(dmg)],
  },
  12502: {
    desc: ([atkBonus, killAtkBonus]) => [p(atkBonus), p(killAtkBonus)],
  },
  13301: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  13302: {
    desc: ([dmg]) => [p(dmg)],
  },
  13303: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  13401: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  13402: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  13403: {
    desc: ([dmg]) => [p(dmg)],
  },
  13405: {
    desc: ([, atkBonus, atkBonusLess, defBonus]) => [
      p(atkBonusLess),
      p(defBonus),
      p(atkBonus),
    ],
  },
  13501: {
    desc: ([hpBonus, atkBonus, atkBonusExtra]) => [
      p(hpBonus),
      p(atkBonus),
      p(atkBonusExtra),
    ],
  },
  13502: {
    desc: ([chcBonus, atkSpdBonus, dmgChance, dmg]) => [
      p(chcBonus),
      p(atkSpdBonus),
      p(dmgChance),
      p(dmg),
    ],
  },
  13505: {
    desc: ([atkBonus, dmgBonus]) => [p(atkBonus), p(dmgBonus)],
  },
  14302: {
    desc: ([atkBonus]) => [p(atkBonus)],
  },
  14303: {
    desc: ([hpRestore]) => [p(hpRestore)],
  },
  14304: {
    desc: ([atkBonus]) => [p(atkBonus)],
  },
  14305: {
    desc: ([moveSpdAndAtkBonus]) => [p(moveSpdAndAtkBonus)],
  },
  14402: {
    desc: ([atkBonus, dmgBonus, em]) => [p(atkBonus), p(dmgBonus), v(em)],
  },
  14405: {
    desc: ([dmgBonus]) => [p(dmgBonus), p(dmgBonus)],
  },
  14406: {
    desc: ([, , energy, hpRestore]) => [v(energy), p(hpRestore)],
  },
  14407: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  14409: {
    desc: ([, , atkBonus, cd]) => [p(atkBonus), v(cd)],
  },
  14410: {
    desc: ([atkBonus, , staReduce]) => [p(staReduce), p(atkBonus)],
  },
  14501: {
    desc: ([dmgBonus, , dmg]) => [p(dmgBonus), p(dmg)],
  },
  14502: {
    desc: ([, dmgBonus]) => [p(dmgBonus)],
  },
  15302: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  15304: {
    desc: ([, dmgBonus]) => [p(dmgBonus)],
  },
  15305: {
    desc: ([dmg]) => [p(dmg)],
  },
  15402: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  15405: {
    desc: ([dmgBonus]) => [p(dmgBonus)],
  },
  15406: {
    desc: ([, atkBonus]) => [p(atkBonus)],
  },
  15407: {
    desc: ([atkBonus, atkSpdBonus]) => [p(atkBonus), p(atkSpdBonus)],
  },
  15409: {
    desc: ([, dmg, , , cd]) => [p(dmg), v(cd)],
  },
  15410: {
    desc: ([dmgBonus]) => [p(dmgBonus), p(dmgBonus * 10), p(dmgBonus * 2)],
  },
  15413: {
    desc: ([atkBonus]) => [p(atkBonus)],
  },
  15501: {
    desc: ([chdBonus, dmgChance, , cd]) => [p(chdBonus), p(dmgChance), v(cd)],
  },
  15502: {
    desc: ([dmgBonus, dmgBonusExtra]) => [p(dmgBonus), p(dmgBonusExtra)],
  },
  15503: {
    desc: ([em, , , emExtra, atkBonus]) => [v(em), v(emExtra), p(atkBonus)],
  },
};
