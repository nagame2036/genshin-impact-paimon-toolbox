import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../models/inventory-item';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-enemies-materials',
  templateUrl: './inventory-enemies-materials.component.html',
  styleUrls: ['./inventory-enemies-materials.component.sass']
})
export class InventoryEnemiesMaterialsComponent implements OnInit {

  items: InventoryItem[] = [];

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getItems('enemies-materials').subscribe(res => this.items = res);
  }

}
