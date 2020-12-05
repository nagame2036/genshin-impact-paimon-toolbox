import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CharacterStatProfile} from '../character-stat-profile';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';
import {CharacterStatOptimizerService} from '../character-stat-optimizer.service';

@Component({
  selector: 'app-character-stat-optimizer',
  templateUrl: './character-stat-optimizer.component.html',
  styleUrls: ['./character-stat-optimizer.component.sass']
})
export class CharacterStatOptimizerComponent extends AbstractTranslateComponent implements OnInit, OnChanges {

  i18nKey = 'character-stat.optimizer';

  @Input()
  profile: CharacterStatProfile = new CharacterStatProfile();

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

  optimizedResult: { atk: number; critRate: number; critDmg: number; } = {atk: 0, critRate: 0, critDmg: 0};

  @Output()
  optimizedStat = new EventEmitter<CharacterStatProfile>();

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

  constructor(private optimizer: CharacterStatOptimizerService) {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.optimized = false;
    this.statFields[0].value = this.atkPct;
    this.statFields[1].value = this.critRatePct;
    this.statFields[2].value = this.critDmgBonusPct;
  }

  optimize(): void {
    // the weight of ATK : CRIT Rate : CRIT DMG = 1.5 : 1 : 2.
    const points = (this.atkPct / 1.5 + this.critRatePct + this.critDmgBonusPct / 2);
    const result = this.optimizer.optimize(this.profile.baseAtk, this.profile.plumeAtk, points);
    this.optimizedFields[0].value = result.atk;
    this.optimizedFields[1].value = result.critRate;
    this.optimizedFields[2].value = result.critDmg;
    this.optimizedResult = result;
    this.optimized = true;
  }

  copyAndCompare(): void {
    const baseAtk = this.profile.baseAtk;
    const bonusAtk = baseAtk * this.optimizedResult.atk + this.profile.plumeAtk;
    const chc = this.optimizedResult.critRate;
    const critRate = chc === 0 ? .05 : chc + .15;
    const chd = this.optimizedResult.critDmg;
    const critDmgBonus = chd === 0 ? .5 : chd + .3;
    const profile = new CharacterStatProfile(this.profile.level, this.profile.dmgType, baseAtk, this.profile.plumeAtk,
      bonusAtk, critRate, critDmgBonus, this.profile.elementalDmgBonus);
    this.optimizedStat.emit(profile);
  }
}
