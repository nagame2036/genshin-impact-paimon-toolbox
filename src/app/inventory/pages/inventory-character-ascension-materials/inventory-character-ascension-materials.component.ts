import {Component, OnInit} from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {InventoryItem} from '../../models/inventory-item';

@Component({
  selector: 'app-inventory-character-ascension-materials',
  templateUrl: './inventory-character-ascension-materials.component.html',
  styleUrls: ['./inventory-character-ascension-materials.component.sass']
})
export class InventoryCharacterAscensionMaterialsComponent implements OnInit {

  items: InventoryItem[] = [];

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getItems('character-ascension-materials').subscribe(res => this.items = res);
  }

}
