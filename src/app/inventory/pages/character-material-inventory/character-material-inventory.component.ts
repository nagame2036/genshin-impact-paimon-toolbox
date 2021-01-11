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

  rarities = [5, 4, 3, 2];

  constructor(private materials: MaterialService, inventory: InventoryService) {
    super(inventory);
  }

  ngOnInit(): void {
    this.common$ = this.filterItems(this.materials.getMaterials(MaterialType.CHARACTER_EXP));
    this.boss$ = this.filterItems(this.materials.getMaterials(MaterialType.CHARACTER_BOSS));
    this.gem$ = this.filterItems(this.materials.getMaterials(MaterialType.CHARACTER_GEM));
  }
}
