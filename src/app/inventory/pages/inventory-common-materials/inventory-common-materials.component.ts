import {Component, OnInit} from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {InventoryItem} from '../../models/inventory-item';

@Component({
  selector: 'app-inventory-common-materials',
  templateUrl: './inventory-common-materials.component.html',
  styleUrls: ['./inventory-common-materials.component.sass']
})
export class InventoryCommonMaterialsComponent implements OnInit {

  characterExps: InventoryItem[] = [];

  weaponExps: InventoryItem[] = [];

  ores: InventoryItem[] = [];

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getItems('character-exp-items').subscribe(res => this.characterExps = res);
    this.inventory.getItems('weapon-exp-items').subscribe(res => this.weaponExps = res);
    this.inventory.getItems('ore-items').subscribe(res => this.ores = res);
  }

}
