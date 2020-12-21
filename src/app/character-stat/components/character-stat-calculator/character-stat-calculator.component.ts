import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';
import {CharacterStatProfile} from '../../models/character-stat-profile.model';
import {StatField} from '../../models/stat-field.model';
import {DamageType} from '../../models/damage-type.enum';
import {CharacterStatProfileService} from '../../services/character-stat-profile.service';

@Component({
  selector: 'app-character-stat-calculator',
  templateUrl: './character-stat-calculator.component.html',
  styleUrls: ['./character-stat-calculator.component.sass']
})
export class CharacterStatCalculatorComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat';

  profile = new CharacterStatProfile();

  enemyLevel = new StatField({min: 1, max: 110, defaultValue: 90});

  enemyElementalRes = new StatField({min: -100, max: 100, defaultValue: 10, suffix: '%'});

  enemyDmgRes!: number;

  talents = [
    new StatField({min: 0, defaultValue: 100}),
    new StatField({min: 0, defaultValue: 100}),
    new StatField({min: 0, defaultValue: 100})
  ];

  dmgFields = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  dmgLabels = [
    'no-crit-hit-dmg',
    'crit-hit-dmg',
    'avg-hit-dmg'
  ];

  constructor(private profileService: CharacterStatProfileService) {
    super();
  }

  get dmgType(): DamageType {
    return this.profile.dmgType;
  }

  get defFactor(): number {
    const characterLevel = this.profile.level.level;
    const enemyLevel = this.enemyLevel.value;
    return (characterLevel + 100) / (characterLevel + enemyLevel + 200);
  }

  get dmgFactor(): number {
    const res = this.enemyElementalRes.value;
    const resFactor = 1 - (res < 0 ? (res / 2) : res) / 100;
    return Math.max(0, this.defFactor * resFactor);
  }

  ngOnInit(): void {
    this.profileService.current.subscribe(c => {
      this.profile = c;
      this.calc();
    });
  }

  calc(): void {
    this.enemyDmgRes = (1 - this.dmgFactor) * 100;
    for (let i = 0; i < 3; i++) {
      const dmgField = this.dmgFields[i];
      dmgField[0] = this.profile.baseDmg * this.dmgFactor;
      dmgField[1] = this.profile.critDmg * this.dmgFactor;
      dmgField[2] = this.profile.meanDmg * this.dmgFactor;
    }
  }

}
