import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../shared/models/i18n.model';
import {NavBarLink} from '../../../shared/components/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss']
})
export class InventoryPageComponent implements OnInit {

  i18n = new I18n('inventory');

  links: NavBarLink[] = [
    {path: 'character-materials', text: this.i18n.dict('character-materials')},
    {path: 'talent-materials', text: this.i18n.dict('talent-materials')},
    {path: 'weapon-materials', text: this.i18n.dict('weapon-materials')},
    {path: 'enemies-materials', text: this.i18n.dict('enemies-materials')},
    {path: 'ingredients', text: this.i18n.dict('ingredients')},
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
