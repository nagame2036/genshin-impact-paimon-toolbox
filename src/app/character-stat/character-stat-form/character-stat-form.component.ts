import {Component, OnInit} from '@angular/core';
import {CharacterStat} from './character-stat';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';

@Component({
  selector: 'app-character-stat-form',
  templateUrl: './character-stat-form.component.html',
  styleUrls: ['./character-stat-form.component.sass']
})
export class CharacterStatFormComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat.form';

  stat = [
    {label: 'current', stat: new CharacterStat()},
    {label: 'new', stat: new CharacterStat()}
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
