import {Component, OnInit} from '@angular/core';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';
import {WeaponExpMaterialService} from '../../../material/services/weapon-exp-material.service';
import {OreMaterialService} from '../../../material/services/ore-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {OreMaterialItem} from '../../../material/models/ore-material.model';
import {characterExp, mora, weaponExp} from '../../../material/models/mora-and-exp.model';

@Component({
  selector: 'app-mora-and-exp-inventory',
  templateUrl: './mora-and-exp-inventory.component.html',
  styleUrls: ['./mora-and-exp-inventory.component.sass']
})
export class MoraAndExpInventoryComponent implements OnInit {

  moraItems = [mora];

  characterExpMaterials: InventoryItem[] = [];

  weaponExpMaterials: InventoryItem[] = [];

  oreMaterials: OreMaterialItem[] = [];

  constructor(public characters: CharacterExpMaterialService, public weapons: WeaponExpMaterialService, public ores: OreMaterialService) {
  }

  ngOnInit(): void {
    this.characters.items.subscribe(res => this.characterExpMaterials = [characterExp, ...res]);
    this.weapons.items.subscribe(res => this.weaponExpMaterials = [weaponExp, ...res]);
    this.ores.items.subscribe(res => this.oreMaterials = res);
  }

}
