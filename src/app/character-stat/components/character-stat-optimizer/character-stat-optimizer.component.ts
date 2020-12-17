import {Component, OnInit} from '@angular/core';
import {CharacterStatProfile} from '../../models/character-stat-profile';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {CharacterStatOptimizerService} from '../../services/character-stat-optimizer.service';
import {CharacterStatProfileService} from '../../services/character-stat-profile.service';
import {OptimizedStat} from '../../models/optimized-result.model';

@Component({
  selector: 'app-character-stat-optimizer',
  templateUrl: './character-stat-optimizer.component.html',
  styleUrls: ['./character-stat-optimizer.component.sass']
})
export class CharacterStatOptimizerComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat.optimizer';

  profile!: CharacterStatProfile;

  statFields = [
    {label: 'atk-pct', value: 0},
    {label: 'crit-rate-pct', value: 0},
    {label: 'crit-dmg-bonus-pct', value: 0}
  ];

  optimizedFields = [
    {label: 'atk-pct', value: 0},
    {label: 'crit-rate-pct', value: 0},
    {label: 'crit-dmg-bonus-pct', value: 0},
  ];

  optimized = false;

  optimizedResult: OptimizedStat = {atk: 0, critRate: 0, critDmg: 0};

  fields = [
    {
      label: 'current',
      visible: () => true,
      fields: this.statFields,
      color: 'primary',
      action: () => this.optimize(),
      actionText: 'optimize'
    },
    {
      label: 'optimized',
      visible: () => this.optimized,
      fields: this.optimizedFields,
      color: 'accent',
      action: () => this.copyAndCompare(),
      actionText: 'copy-and-compare'
    }
  ];

  constructor(private optimizer: CharacterStatOptimizerService, private profileService: CharacterStatProfileService) {
    super();
  }

  get atkPct(): number {
    return ((this.profile.bonusAtk - this.profile.plumeAtk) / this.profile.baseAtk) || 0;
  }

  get critRatePct(): number {
    return this.profile.critRate - .05;
  }

  get critDmgBonusPct(): number {
    return this.profile.critDmgBonus - .5;
  }

  ngOnInit(): void {
    this.profileService.current.subscribe(p => {
      this.profile = p;
      this.optimized = false;
      this.statFields[0].value = this.atkPct;
      this.statFields[1].value = this.critRatePct;
      this.statFields[2].value = this.critDmgBonusPct;
    });
  }

  optimize(): void {
    // the weight of ATK : CRIT Rate : CRIT DMG = 1.5 : 1 : 2.
    const points = this.atkPct / 1.5 + this.critRatePct + this.critDmgBonusPct / 2;
    const result = this.optimizer.optimize(this.profile.baseAtk, this.profile.plumeAtk, points);
    this.optimizedFields[0].value = result.atk;
    this.optimizedFields[1].value = result.critRate;
    this.optimizedFields[2].value = result.critDmg;
    this.optimizedResult = result;
    this.optimized = true;
  }

  copyAndCompare(): void {
    const baseAtk = this.profile.baseAtk;
    const plumeAtk = this.profile.plumeAtk;
    const bonusAtk = baseAtk * this.optimizedResult.atk + plumeAtk;
    const critRate = this.optimizedResult.critRate + .05;
    const critDmgBonus = this.optimizedResult.critDmg + .5;
    const profile = new CharacterStatProfile(this.profile.level, this.profile.dmgType, baseAtk, plumeAtk,
      bonusAtk, critRate, critDmgBonus, this.profile.elementalDmgBonus);
    this.profileService.setCompared(profile);
  }
}
