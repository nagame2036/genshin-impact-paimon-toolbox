import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';
import {CharacterStatProfile} from '../character-stat-profile';
import {StatField} from '../stat-field';
import {FormControl} from '@angular/forms';
import {DamageType} from '../character-stat-profile/damage-type';

@Component({
  selector: 'app-character-stat-calculator',
  templateUrl: './character-stat-calculator.component.html',
  styleUrls: ['./character-stat-calculator.component.sass']
})
export class CharacterStatCalculatorComponent extends AbstractTranslateComponent implements OnInit, OnChanges {

  i18nKey = 'character-stat';

  @Input()
  profile: CharacterStatProfile = new CharacterStatProfile();

  enemyLevel = new StatField({min: 1, max: 110, defaultValue: 90});

  enemyElementalRes = new StatField({min: -100, max: 100, defaultValue: 10, suffix: '%'});

  enemyDmgRes = new FormControl('55.0');

  talents = [
    new StatField({min: 0, defaultValue: 100}),
    new StatField({min: 0, defaultValue: 100}),
    new StatField({min: 0, defaultValue: 100})
  ];

  dmgFields = [
    [new FormControl('0.0'), new FormControl('0.0'), new FormControl('0.0')],
    [new FormControl('0.0'), new FormControl('0.0'), new FormControl('0.0')],
    [new FormControl('0.0'), new FormControl('0.0'), new FormControl('0.0')]
  ];

  dmgLabels = [
    'no-crit-hit-dmg',
    'crit-hit-dmg',
    'avg-hit-dmg'
  ];

  constructor() {
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
  }

  ngOnChanges(): void {
    this.calc();
  }

  calc(): void {
    const dmgRes = (1 - this.dmgFactor) * 100;
    this.enemyDmgRes.setValue(dmgRes.toFixed(1));
    for (let i = 0; i < 3; i++) {
      const dmgField = this.dmgFields[i];
      dmgField[0].setValue((this.profile.baseDmg * this.dmgFactor).toFixed(1));
      dmgField[1].setValue((this.profile.critDmg * this.dmgFactor).toFixed(1));
      dmgField[2].setValue((this.profile.meanDmg * this.dmgFactor).toFixed(1));
    }
  }

}
