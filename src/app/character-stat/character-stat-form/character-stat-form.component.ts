import {Component, OnInit} from '@angular/core';
import {CharacterStat} from './character-stat';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';
import {CharacterStatComparer} from './character-stat-comparer';

@Component({
  selector: 'app-character-stat-form',
  templateUrl: './character-stat-form.component.html',
  styleUrls: ['./character-stat-form.component.sass']
})
export class CharacterStatFormComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat.form';

  current = {label: 'current', stat: new CharacterStat()};

  newStat = {label: 'new', stat: new CharacterStat()};

  stat = [
    this.current,
    this.newStat
  ];

  comparer = new CharacterStatComparer(this.current.stat, this.newStat.stat);

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
