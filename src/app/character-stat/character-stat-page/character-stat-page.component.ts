import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../shared/abstract-translate.component';

@Component({
  selector: 'app-character-stat-page',
  templateUrl: './character-stat-page.component.html',
  styleUrls: ['./character-stat-page.component.sass']
})
export class CharacterStatPageComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'character-stat';

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
