import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CharacterStat} from '../character-stat';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';
import {CharacterStatComparer} from '../character-stat-comparer';
import {FormControl} from '@angular/forms';
import {DamageType} from './damage-type';
import {CharacterStatProfile} from '../character-stat-profile';
import {Level} from '../../shared/ascension-level-select/level';

@Component({
  selector: 'app-character-stat-profile',
  templateUrl: './character-stat-profile.component.html',
  styleUrls: ['./character-stat-profile.component.sass']
})
export class CharacterStatProfileComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat.form';

  level = new Level();

  dmgType = new FormControl(DamageType.PYRO);

  dmgTypes = Object.values(DamageType);

  current = new CharacterStat('current', this.level, this.dmgType);

  compare = new CharacterStat('compare', this.level, this.dmgType);

  stat = [this.current, this.compare];

  comparer = new CharacterStatComparer(this.current, this.compare);

  @Output()
  profile = new EventEmitter<CharacterStatProfile>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.calc(true);
  }

  calc(updateProfile: boolean): void {
    const profile = this.current.calc();
    this.compare.calc();
    this.comparer.calc();
    if (updateProfile) {
      this.profile.emit(profile);
    }
  }

  receiveOptimizedStat(profile: CharacterStatProfile): void {
    this.compare.copyFromProfile(profile);
    this.comparer.calc();
  }
}
