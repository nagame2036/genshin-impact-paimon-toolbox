import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {DamageType} from '../../models/damage-type.enum';
import {CharacterStatProfile} from '../../models/character-stat-profile.model';
import {CharacterStatProfileService} from '../../services/character-stat-profile.service';
import {AbstractObservableComponent} from '../../../shared/components/abstract-observable.component';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-character-stat-analyzer',
  templateUrl: './character-stat-analyzer.component.html',
  styleUrls: ['./character-stat-analyzer.component.scss']
})
export class CharacterStatAnalyzerComponent extends AbstractObservableComponent implements OnInit {

  i18n = new I18n('character-stat.analyzer');

  profile!: CharacterStatProfile;

  fields = [
    {text: 'atk-inc', value: () => this.dmgWhenAtkInc},
    {text: 'crit-rate-inc', value: () => this.dmgWhenCritRateInc},
    {text: 'crit-dmg-bonus-inc', value: () => this.dmgWhenCritDmgBonusInc},
    {text: 'elemental-dmg-bonus-inc', value: () => this.dmgWhenElementalDmgBonusInc},
  ];

  profiles = new Map<{ text: string, value: () => number }, CharacterStatProfile>();

  constructor(private profileService: CharacterStatProfileService) {
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
    this.profiles.set(this.fields[0], copy);
    const baseAtk = copy.baseAtk;
    const plumeAtk = copy.plumeAtk;
    const bonusAtkPct = (copy.bonusAtk - plumeAtk) / baseAtk || 0;
    copy.bonusAtk = (bonusAtkPct + 0.15) * baseAtk + plumeAtk;
    return copy.meanDmg - this.profile.meanDmg;
  }

  get dmgWhenCritRateInc(): number {
    const copy = this.profile.copy();
    this.profiles.set(this.fields[1], copy);
    copy.critRate += 0.1;
    return copy.meanDmg - this.profile.meanDmg;
  }

  get dmgWhenCritDmgBonusInc(): number {
    const copy = this.profile.copy();
    this.profiles.set(this.fields[2], copy);
    copy.critDmgBonus += 0.2;
    return copy.meanDmg - this.profile.meanDmg;
  }

  get dmgWhenElementalDmgBonusInc(): number {
    const copy = this.profile.copy();
    this.profiles.set(this.fields[3], copy);
    copy.elementalDmgBonus += this.weight * 0.1;
    return copy.meanDmg - this.profile.meanDmg;
  }

  ngOnInit(): void {
    this.profileService.current
      .pipe(takeUntil(this.destroy$))
      .subscribe(p => this.profile = p);
  }

  copyAndCompare(field: { text: string, value: () => number }): void {
    const value = this.profiles.get(field);
    if (value) {
      this.profileService.setCompared(value);
    }
  }

}
