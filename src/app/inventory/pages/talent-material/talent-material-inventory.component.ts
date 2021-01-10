import {Component, OnInit} from '@angular/core';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {MaterialService} from '../../../material/services/material.service';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {MaterialTypes} from '../../../material/models/material-types.enum';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-talent-material-inventory',
  templateUrl: './talent-material-inventory.component.html',
  styleUrls: ['./talent-material-inventory.component.scss']
})
export class TalentMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common$!: Observable<InventoryItem[]>;

  monThu$!: Observable<InventoryItem[]>;

  tueFri$!: Observable<InventoryItem[]>;

  wedSat$!: Observable<InventoryItem[]>;

  rarities = [5, 4, 3, 2];

  constructor(private materials: MaterialService) {
    super();
  }

  ngOnInit(): void {
    this.common$ = this.filterItems(this.materials.getMaterials(MaterialTypes.TALENT_COMMON));
    this.monThu$ = this.filterItems(this.materials.getMaterials(MaterialTypes.TALENT_14));
    this.tueFri$ = this.filterItems(this.materials.getMaterials(MaterialTypes.TALENT_25));
    this.wedSat$ = this.filterItems(this.materials.getMaterials(MaterialTypes.TALENT_36));
  }
}
