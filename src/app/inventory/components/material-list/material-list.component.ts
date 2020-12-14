import {Component, Input, OnInit} from '@angular/core';
import {InventoryItem} from '../../../shared/models/materials/inventory-item';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.sass']
})
export class MaterialListComponent implements OnInit {

  @Input()
  items: InventoryItem[] | null = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
