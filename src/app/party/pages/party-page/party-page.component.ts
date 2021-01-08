import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';

@Component({
  selector: 'app-party-page',
  templateUrl: './party-page.component.html',
  styleUrls: ['./party-page.component.scss']
})
export class PartyPageComponent implements OnInit {

  i18n = new I18n('party');

  links = [
    'characters',
    'weapons'
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
