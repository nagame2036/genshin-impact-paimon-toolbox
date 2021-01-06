import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {CommonMaterialService} from '../../../material/services/common-material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {partitionArrays} from '../../../shared/utils/collections';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-common-material-inventory',
  templateUrl: './common-material-inventory.component.html',
  styleUrls: ['./common-material-inventory.component.sass']
})
export class CommonMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  items$!: Observable<InventoryItem[][]>;

  rarities = [4, 3, 2, 1];

  constructor(private materials: CommonMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.items$ = this.filterItems(this.materials.items)
      .pipe(map(items => partitionArrays(items, [item => item.id < 9000])));
  }

}
