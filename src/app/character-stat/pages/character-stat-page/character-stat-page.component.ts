import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-character-stat-page',
  templateUrl: './character-stat-page.component.html',
  styleUrls: ['./character-stat-page.component.scss']
})
export class CharacterStatPageComponent implements OnInit {

  i18n = new I18n('character-stat');

  constructor() {
  }

  ngOnInit(): void {
  }

}
