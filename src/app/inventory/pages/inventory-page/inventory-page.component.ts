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
    {path: 'character-material', text: this.i18n.dict('character-material')},
    {path: 'talent-material', text: this.i18n.dict('talent-material')},
    {path: 'weapon-material', text: this.i18n.dict('weapon-material')},
    {path: 'enemy-material', text: this.i18n.dict('enemy-material')},
    {path: 'ingredients', text: this.i18n.dict('ingredients')},
  ];

  constructor(public characters: CharacterService, public weapons: WeaponService) {
    // inject these services because materials required by item's plans.
  }

  ngOnInit(): void {}
}
