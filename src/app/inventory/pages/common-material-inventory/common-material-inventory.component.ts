import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {CommonMaterialService} from '../../../material/services/common-material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {partitionArrays} from '../../../shared/utils/collections';

@Component({
  selector: 'app-common-material-inventory',
  templateUrl: './common-material-inventory.component.html',
  styleUrls: ['./common-material-inventory.component.sass']
})
export class CommonMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  mobs: InventoryItem[] = [];

  elites: InventoryItem[] = [];

  rarities = [4, 3, 2, 1];

  constructor(private materials: CommonMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.filterItems(this.materials.items)
      .subscribe(items => [this.mobs, this.elites] = partitionArrays(items, [item => item.id < 9000]));
  }

}
