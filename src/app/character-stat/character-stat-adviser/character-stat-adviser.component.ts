import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';
import {DamageType} from '../character-stat-profile/damage-type';
import {CharacterStatProfile} from '../character-stat-profile';

@Component({
  selector: 'app-character-stat-adviser',
  templateUrl: './character-stat-adviser.component.html',
  styleUrls: ['./character-stat-adviser.component.sass']
})
export class CharacterStatAdviserComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat.adviser';

  @Input()
  profile = new CharacterStatProfile();

  fields = [
    {text: 'atk-inc', profile: this.profile, value: () => this.dmgWhenAtkInc},
    {text: 'crit-rate-inc', profile: this.profile, value: () => this.dmgWhenCritRateInc},
    {text: 'crit-dmg-bonus-inc', profile: this.profile, value: () => this.dmgWhenCritDmgBonusInc},
    {text: 'elemental-dmg-bonus-inc', profile: this.profile, value: () => this.dmgWhenElementalDmgBonusInc},
  ];

  @Output()
  comparedStat = new EventEmitter<CharacterStatProfile>();

  constructor() {
    super();
  }

  get weight(): number {
    return this.profile.dmgType === DamageType.PHYSICAL ? 1.875 : 1.5;
  }

  get dmgType(): DamageType {
    return this.profile.dmgType;
  }

  get dmgWhenAtkInc(): number {
    const copy = this.profile.copy();
    this.fields[0].profile = copy;
    const baseAtk = copy.baseAtk;
    const plumeAtk = copy.plumeAtk;
    const bonusAtkPct = (copy.bonusAtk - plumeAtk) / baseAtk || 0;
    copy.bonusAtk = (bonusAtkPct + 0.15) * baseAtk + plumeAtk;
    return copy.meanDmg - this.profile.meanDmg;
  }

  get dmgWhenCritRateInc(): number {
    const copy = this.profile.copy();
    this.fields[1].profile = copy;
    copy.critRate += 0.1;
    return copy.meanDmg - this.profile.meanDmg;
  }

  get dmgWhenCritDmgBonusInc(): number {
    const copy = this.profile.copy();
    this.fields[2].profile = copy;
    copy.critDmgBonus += 0.2;
    return copy.meanDmg - this.profile.meanDmg;
  }

  get dmgWhenElementalDmgBonusInc(): number {
    const copy = this.profile.copy();
    this.fields[3].profile = copy;
    copy.elementalDmgBonus += this.weight * 0.1;
    return copy.meanDmg - this.profile.meanDmg;
  }

  ngOnInit(): void {
  }

  copyAndCompare(field: { profile: CharacterStatProfile }): void {
    this.comparedStat.emit(field.profile);
  }

}
