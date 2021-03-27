import {Component, OnInit} from '@angular/core';
import {I18n} from '../../../widget/models/i18n.model';
import {NavBarLink} from '../../../widget/components/nav-tabs/nav-tabs.component';
import {CharacterService} from '../../../character/services/character.service';
import {WeaponService} from '../../../weapon/services/weapon.service';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.scss'],
})
export class InventoryPageComponent implements OnInit {
  i18n = I18n.create('inventory');

  links: NavBarLink[] = [
    {path: 'character-materials', text: this.i18n.dict('character-materials')},
    {path: 'talent-materials', text: this.i18n.dict('talent-materials')},
    {path: 'weapon-materials', text: this.i18n.dict('weapon-materials')},
    {path: 'enemies-materials', text: this.i18n.dict('enemies-materials')},
    {path: 'ingredients', text: this.i18n.dict('ingredients')},
  ];

  constructor(
    public characters: CharacterService,
    public weapons: WeaponService,
  ) {
    // inject these services because materials required by item's plans.
  }

  ngOnInit(): void {}
}
