import {Component, OnInit} from '@angular/core';
import {CharacterExpMaterialService} from '../../../shared/services/character-exp-material.service';
import {WeaponExpMaterialService} from '../../../shared/services/weapon-exp-material.service';
import {OreMaterialService} from '../../../shared/services/ore-material.service';

@Component({
  selector: 'app-mora-and-exp-inventory',
  templateUrl: './mora-and-exp-inventory.component.html',
  styleUrls: ['./mora-and-exp-inventory.component.sass']
})
export class MoraAndExpInventoryComponent implements OnInit {

  constructor(public characters: CharacterExpMaterialService, public weapons: WeaponExpMaterialService, public ores: OreMaterialService) {
  }

  ngOnInit(): void {
  }

}
