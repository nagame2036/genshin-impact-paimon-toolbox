import {Component, OnInit} from '@angular/core';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';
import {WeaponExpMaterialService} from '../../../material/services/weapon-exp-material.service';
import {OreMaterialService} from '../../../material/services/ore-material.service';
import {CharacterExpMaterialItem} from '../../../material/models/character-exp-material';
import {WeaponExpMaterialItem} from '../../../material/models/weapon-exp-material';
import {OreMaterialItem} from '../../../material/models/ore-material';

@Component({
  selector: 'app-mora-and-exp-inventory',
  templateUrl: './mora-and-exp-inventory.component.html',
  styleUrls: ['./mora-and-exp-inventory.component.sass']
})
export class MoraAndExpInventoryComponent implements OnInit {

  mora = [{id: 0, rarity: 5}];

  characterExpMaterials: CharacterExpMaterialItem[] = [];

  weaponExpMaterials: WeaponExpMaterialItem[] = [];

  oreMaterials: OreMaterialItem[] = [];

  constructor(public characters: CharacterExpMaterialService, public weapons: WeaponExpMaterialService, public ores: OreMaterialService) {
  }

  ngOnInit(): void {
    this.characters.items.subscribe(res => this.characterExpMaterials = res);
    this.weapons.items.subscribe(res => this.weaponExpMaterials = res);
    this.ores.items.subscribe(res => this.oreMaterials = res);
  }

}
