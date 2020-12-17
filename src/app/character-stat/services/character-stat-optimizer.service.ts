import {Injectable} from '@angular/core';
import {OptimizedStat} from '../models/optimized-result.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterStatOptimizerService {

  readonly atkWeight = 1.5;

  readonly critDmgWeight = 2;

  constructor() {
  }

  /**
   * Optimize the stat points allocation of Base ATK, CRIT Rate and CRIT DMG.
   *
   * @param baseAtk Base ATK
   * @param plumeAtk Plume of Death ATK
   * @param statPoints total stat points of Base ATK, CRIT Rate and CRIT DMG
   */
  optimize(baseAtk: number, plumeAtk: number, statPoints: number): OptimizedStat {
    const self = this;

    // Max number of allocated points for CRIT Rate = 85, equivalent to 100% CRIT Rate
    const maxCritRate = .85;

    // Stat points should all allocated to ATK when number of stat points <= this value
    const pointsWhenAllocatedCritRate = 1.54364026;

    // Min number of stat points to create max DMG when CRIT Rate = 100%
    const pointsWhenAllocatedMaxCritRate = 2.533270835;

    if (statPoints <= pointsWhenAllocatedCritRate) {
      return {atk: this.atkWeight * statPoints, critRate: 0, critDmg: 0};
    } else if (statPoints >= pointsWhenAllocatedMaxCritRate) {
      return this.optimizeWhenMaxCritRate(maxCritRate, plumeAtk, baseAtk, statPoints);
    }

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
      const atk = plumeAtk + baseAtk * (1 + self.atkWeight * (statPoints - critPoints));
      const critRate = Math.min(maxCritRate, .5 * critPoints);

      // Change base CRIT Rate and CRIT DMG to 15% and 30% to keep their ratio 1 : 2
      return atk * (1 + (critRate + .15) * (self.critDmgWeight * critRate + .3));
    }

    const precision = 0.0001;
    const end = statPoints / precision;
    // 70 CRIT points is equivalent to 50% CRIT Rate and 100% CRIT DMG in stat
    let maxCritPoints = 7000;
    let maxDmg = damage(maxCritPoints * precision);

    // Use the gradient ascent method to fast find the number of CRIT points allocated to create the max DMG
    for (const step of [5000, 1000, 100, 10, 1, .1]) {
      for (let critPoints = maxCritPoints; critPoints <= end; critPoints += step) {
        const currDmg = damage(critPoints * precision);
        if (maxDmg <= currDmg) {
          maxCritPoints = critPoints;
          maxDmg = currDmg;
        } else {
          // gradient < 0, approached to max value
          break;
        }
      }
    }
    maxCritPoints *= precision;
    const optimizedAtk = this.atkWeight * (statPoints - maxCritPoints);
    const optimizedCritRate = Math.min(maxCritRate, .5 * maxCritPoints);
    const optimizedCritDmg = this.critDmgWeight * (maxCritPoints - optimizedCritRate);
    return {atk: optimizedAtk, critRate: optimizedCritRate + .1, critDmg: optimizedCritDmg - .2};
  }

  private optimizeWhenMaxCritRate(maxCritRate: number, plumeAtk: number, baseAtk: number, statPoints: number): OptimizedStat {
    const critRateAllocated = maxCritRate + .1;
    const atkWhenMaxCritRate = 1.249906251405;
    const atkAllocated = (atkWhenMaxCritRate - plumeAtk / baseAtk) / this.atkWeight;
    const critDmgWhenMaxCritRate = 1.5;
    const critDmgAllocated = critDmgWhenMaxCritRate / this.critDmgWeight;
    const remainingStatPoints = statPoints - critRateAllocated - atkAllocated - critDmgAllocated;
    const critDmg = remainingStatPoints + critDmgWhenMaxCritRate;
    const atk = .75 * remainingStatPoints - plumeAtk / baseAtk + atkWhenMaxCritRate;
    return {atk, critRate: maxCritRate + .1, critDmg};
  }
}
