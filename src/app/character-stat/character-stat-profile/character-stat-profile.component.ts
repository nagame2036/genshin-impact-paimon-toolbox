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

  level!: Level;

  dmgType = new FormControl(DamageType.PYRO);

  dmgTypes = Object.values(DamageType);

  current = new CharacterStat('current');

  newStat = new CharacterStat('new');

  stat = [this.current, this.newStat];

  comparer = new CharacterStatComparer(this.current, this.newStat);

  @Output()
  profile = new EventEmitter<CharacterStatProfile>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.calc();
  }

  calc(): void {
    const dmgType = this.dmgType.value;
    const profile = this.current.calc(this.level, dmgType);
    this.newStat.calc(this.level, dmgType);
    this.comparer.calc();
    this.profile.emit(profile);
  }
}
