import {Component, Input, OnInit} from '@angular/core';
import {InventoryItem} from '../../models/inventory-item';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-special-materials',
  templateUrl: './inventory-special-materials.component.html',
  styleUrls: ['./inventory-special-materials.component.sass']
})
export class InventorySpecialMaterialsComponent implements OnInit {

  @Input()
  category!: string;

  items: InventoryItem[] = [];

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getItems(this.category).subscribe(res => this.items = res);
  }

}
