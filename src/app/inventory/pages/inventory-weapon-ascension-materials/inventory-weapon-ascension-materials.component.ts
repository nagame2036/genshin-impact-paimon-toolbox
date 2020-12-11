import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../models/inventory-item';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-weapon-ascension-materials',
  templateUrl: './inventory-weapon-ascension-materials.component.html',
  styleUrls: ['./inventory-weapon-ascension-materials.component.sass']
})
export class InventoryWeaponAscensionMaterialsComponent implements OnInit {

  items: InventoryItem[] = [];

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getItems('weapon-ascension-materials').subscribe(res => this.items = res);
  }

}
