import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {MaterialService} from '../../../material/services/material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {MaterialTypes} from '../../../material/models/material-types.enum';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-common-material-inventory',
  templateUrl: './common-material-inventory.component.html',
  styleUrls: ['./common-material-inventory.component.scss']
})
export class CommonMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  mobs$!: Observable<InventoryItem[]>;

  elites$!: Observable<InventoryItem[]>;

  rarities = [4, 3, 2, 1];

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.mobs$ = this.filterItems(this.materials.getMaterials(MaterialTypes.COMMON_MOB));
    this.elites$ = this.filterItems(this.materials.getMaterials(MaterialTypes.COMMON_ELITE));
  }

}
