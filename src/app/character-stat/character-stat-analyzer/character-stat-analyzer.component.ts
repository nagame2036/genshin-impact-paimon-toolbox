import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CharacterStatProfile} from '../character-stat-profile';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';
import {FormControl} from '@angular/forms';
import {CharacterStatOptimizerService} from '../character-stat-optimizer.service';

function setFieldValue(field: { control: FormControl }, value: number): void {
  field.control.setValue((value * 100).toFixed(1));
}

@Component({
  selector: 'app-character-stat-analyzer',
  templateUrl: './character-stat-analyzer.component.html',
  styleUrls: ['./character-stat-analyzer.component.sass']
})
export class CharacterStatAnalyzerComponent extends AbstractTranslateComponent implements OnInit, OnChanges {

  i18nKey = 'character-stat.analyzer';

  @Input()
  profile: CharacterStatProfile = new CharacterStatProfile();

  statFields = [
    {label: 'atk-pct', control: new FormControl('0.0')},
    {label: 'crit-rate-pct', control: new FormControl('0.0')},
    {label: 'crit-dmg-bonus-pct', control: new FormControl('0.0')}
  ];

  optimizedFields = [
    {label: 'atk-pct', control: new FormControl('0.0')},
    {label: 'crit-rate-pct', control: new FormControl('0.0')},
    {label: 'crit-dmg-bonus-pct', control: new FormControl('0.0')},
  ];

  optimized = false;

  optimizedResult: { atk: number; critRate: number; critDmg: number; } = {atk: 0, critRate: 0, critDmg: 0};

  @Output()
  optimizedStat = new EventEmitter<CharacterStatProfile>();

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
    this.resetCalculatedFields();
    setFieldValue(this.statFields[0], this.atkPct);
    setFieldValue(this.statFields[1], this.critRatePct);
    setFieldValue(this.statFields[2], this.critDmgBonusPct);
  }

  optimize(): void {
    // the weight of ATK : CRIT Rate : CRIT DMG = 1.5 : 1 : 2.
    const points = (this.atkPct / 1.5 + this.critRatePct + this.critDmgBonusPct / 2);
    const result = this.optimizer.optimize(this.profile.baseAtk, this.profile.plumeAtk, points);
    setFieldValue(this.optimizedFields[0], result.atk);
    setFieldValue(this.optimizedFields[1], result.critRate);
    setFieldValue(this.optimizedFields[2], result.critDmg);
    this.optimizedResult = result;
    this.optimized = true;
  }

  copyToStat(): void {
    const baseAtk = this.profile.baseAtk;
    const bonusAtk = baseAtk * this.optimizedResult.atk + 311;
    const chc = this.optimizedResult.critRate;
    const critRate = chc === 0 ? .05 : chc + .15;
    const chd = this.optimizedResult.critDmg;
    const critDmgBonus = chd === 0 ? .5 : chd + .3;
    const profile = new CharacterStatProfile(this.profile.level, this.profile.dmgType, baseAtk, this.profile.plumeAtk,
      bonusAtk, critRate, critDmgBonus, this.profile.elementalDmgBonus);
    this.optimizedStat.emit(profile);
  }

  private resetCalculatedFields(): void {
    this.optimized = false;
  }
}
