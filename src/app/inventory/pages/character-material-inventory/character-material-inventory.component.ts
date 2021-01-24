import {Component, OnInit} from '@angular/core';
import {MaterialService} from '../../../material/services/material.service';
import {InventoryItemDetail} from '../../../material/models/inventory-item-detail.model';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';
import {Observable} from 'rxjs';
import {MaterialType} from '../../../material/models/material-type.enum';
import {InventoryService} from '../../services/inventory.service';

@Component({
  selector: 'app-character-material-inventory',
  templateUrl: './character-material-inventory.component.html',
  styleUrls: ['./character-material-inventory.component.scss']
})
export class CharacterMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common$!: Observable<InventoryItemDetail[]>;

  boss$!: Observable<InventoryItemDetail[]>;

  gem$!: Observable<InventoryItemDetail[]>;

  constructor(materials: MaterialService, inventory: InventoryService) {
    super(materials, inventory);
  }

  ngOnInit(): void {
    this.common$ = this.filterMaterials(MaterialType.CHARACTER_EXP);
    this.boss$ = this.filterMaterials(MaterialType.CHARACTER_BOSS);
    this.gem$ = this.filterMaterials(MaterialType.CHARACTER_GEM);
  }
}
