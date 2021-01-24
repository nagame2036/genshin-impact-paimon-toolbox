import {Component, OnInit} from '@angular/core';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {MaterialService} from '../../../material/services/material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {MaterialType} from '../../../material/models/material-type.enum';
import {Observable} from 'rxjs';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.scss']
})
export class TalentMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common$!: Observable<InventoryItemDetail[]>;

  monThu$!: Observable<InventoryItemDetail[]>;

  tueFri$!: Observable<InventoryItemDetail[]>;

  wedSat$!: Observable<InventoryItemDetail[]>;

  constructor(materials: MaterialService, inventory: InventoryService) {
    super(materials, inventory);
  }

  ngOnInit(): void {
    this.common$ = this.filterMaterials(MaterialType.TALENT_COMMON);
    this.monThu$ = this.filterMaterials(MaterialType.TALENT_14);
    this.tueFri$ = this.filterMaterials(MaterialType.TALENT_25);
    this.wedSat$ = this.filterMaterials(MaterialType.TALENT_36);
  }
}
