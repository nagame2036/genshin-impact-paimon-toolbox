import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {MaterialService} from '../../../material/services/material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {MaterialType} from '../../../material/models/material-type.enum';
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
    this.mobs$ = this.filterItems(this.materials.getMaterials(MaterialType.COMMON_MOB));
    this.elites$ = this.filterItems(this.materials.getMaterials(MaterialType.COMMON_ELITE));
  }

}
