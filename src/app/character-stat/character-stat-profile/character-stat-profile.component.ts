import {Component, OnInit} from '@angular/core';
import {CharacterStat} from './character-stat';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';
import {CharacterStatComparer} from './character-stat-comparer';
import {FormControl} from '@angular/forms';
import {DamageType} from './damage-type';

@Component({
  selector: 'app-character-stat-profile',
  templateUrl: './character-stat-profile.component.html',
  styleUrls: ['./character-stat-profile.component.sass']
})
export class CharacterStatProfileComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat.form';

  dmgType = new FormControl(DamageType.PYRO);

  dmgTypes = Object.values(DamageType);

  current = new CharacterStat('current');

  newStat = new CharacterStat('new');

  stat = [this.current, this.newStat];

  comparer = new CharacterStatComparer(this.current, this.newStat);

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  calc(stat: CharacterStat): void {
    stat.calc();
    this.comparer.calc();
  }
}
