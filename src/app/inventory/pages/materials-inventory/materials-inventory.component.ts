import {Component, Input, OnInit} from '@angular/core';
import {InventoryItem} from '../../models/inventory-item';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-materials-inventory',
  templateUrl: './materials-inventory.component.html',
  styleUrls: ['./materials-inventory.component.sass']
})
export class MaterialsInventoryComponent implements OnInit {

  @Input()
  category!: string;

  items: InventoryItem[] = [];

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getItems(this.category).subscribe(res => this.items = res);
  }

}
