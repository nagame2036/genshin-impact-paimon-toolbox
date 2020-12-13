import {Component, Input, OnInit} from '@angular/core';
import {InventoryItem} from '../../../shared/models/materials/inventory-item';

@Component({
  selector: 'app-materials-inventory',
  templateUrl: './materials-inventory.component.html',
  styleUrls: ['./materials-inventory.component.sass']
})
export class MaterialsInventoryComponent implements OnInit {

  @Input()
  items: InventoryItem[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
