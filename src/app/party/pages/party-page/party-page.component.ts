import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {NavBarLink} from '../../../widget/components/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-party-page',
  templateUrl: './party-page.component.html',
  styleUrls: ['./party-page.component.scss']
})
export class PartyPageComponent implements OnInit {

  i18n = new I18n('party');

  links: NavBarLink[] = [
    {path: 'characters', text: `modules.characters.title`},
    {path: 'weapons', text: `modules.weapons.title`},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
