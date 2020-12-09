import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterStatOptimizerService {

  constructor() {
  }

  /**
   * Optimize the stat points allocation of Base ATK, CRIT Rate and CRIT DMG.
   *
   * @param baseAtk Base ATK
   * @param plumeAtk Plume of Death ATK
   * @param statPoints total stat points of Base ATK, CRIT Rate and CRIT DMG
   */
  optimize(baseAtk: number, plumeAtk: number, statPoints: number): { atk: number, critRate: number, critDmg: number } {

    // Max number of allocated points for CRIT Rate = 85, equivalent to 100% CRIT Rate
    const maxCritRate = .85;
    const atkWeight = 1.5;
    const critDmgWeight = 2;

    /**
     * Calculate damage based on the points added to CRIT Rate and CRIT DMG.
     * <p>
     *   The weight of ATK : CRIT Rate : CRIT DMG = 1.5 : 1 : 2.
     *   Keep the ratio of CRIT Rate : CRIT DMG = 1 : 2 will produce highest CRIT DMG bonus when CRIT Rate between 25% and 100%.
     * </p>
     *
     * @param critPoints Total number of stat points add to CRIT Rate and CRIT DMG
     *
     * @see <a href="https://nga.178.com/read.php?tid=23711373">同数值权重下的暴击暴伤攻击分配</a>
     */
    function damage(critPoints: number): number {
      const atk = plumeAtk + baseAtk * (1 + atkWeight * (statPoints - critPoints));
      const critRate = Math.min(maxCritRate, 0.5 * critPoints);
      const critDmg = critDmgWeight * (critPoints - critRate);

      // Change base CRIT Rate and CRIT DMG to 15% and 30% to keep their ratio 1 : 2
      return atk * (1 + (critRate + .15) * (critDmg + .3));
    }

    // Points all added to ATK, that is DMG = (Plume ATK + Base ATK * (1 + 1.5% * Stat statPoints)) * (1 + 5% Crit Rate * 50% Crit DMG)
    let maxDmg = (plumeAtk + baseAtk * (1 + 1.5 * statPoints)) * 1.025;
    let maxCritPoints = 0;

    // 70 CRIT points is equivalent to 50% CRIT Rate and 100% CRIT DMG in stat
    const start = 7000;
    const precision = 0.0001;
    const end = statPoints / precision;
    for (let critPoints = start; critPoints <= end; critPoints++) {
      const currDmg = damage(critPoints * precision);
      if (maxDmg <= currDmg) {
        maxCritPoints = critPoints * precision;
        maxDmg = currDmg;
      }
    }
    const optimizedCritRate = Math.min(maxCritRate, .5 * maxCritPoints);
    const optimizedAtk = atkWeight * (statPoints - maxCritPoints);
    const optimizedCritDmg = critDmgWeight * (maxCritPoints - optimizedCritRate);
    return {atk: optimizedAtk, critRate: optimizedCritRate, critDmg: optimizedCritDmg};
  }
}
