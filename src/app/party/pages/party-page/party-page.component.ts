import {Component, OnInit} from '@angular/core';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-party-page',
  templateUrl: './party-page.component.html',
  styleUrls: ['./party-page.component.scss']
})
export class PartyPageComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'party';

  links = [
    'characters',
    'weapons'
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
