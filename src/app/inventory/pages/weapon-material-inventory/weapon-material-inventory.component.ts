import {Component, OnInit} from '@angular/core';
import {WeaponMaterialService} from '../../../material/services/weapon-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {WeaponExpMaterialService} from '../../../material/services/weapon-exp-material.service';
import {weaponExp} from '../../../material/models/mora-and-exp.model';
import {partitionArrays} from '../../../shared/utils/collections';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.sass']
})
export class WeaponMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common: InventoryItem[] = [];

  monThu: InventoryItem[] = [];

  tueFri: InventoryItem[] = [];

  wedSat: InventoryItem[] = [];

  constructor(private exps: WeaponExpMaterialService, private materials: WeaponMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.filterItems(this.exps.items)
      .subscribe(items => this.common = [weaponExp, ...items]);
    this.filterItems(this.materials.items)
      .subscribe(items => [this.monThu, this.tueFri, this.wedSat] = partitionArrays(items, [
        item => this.materials.getWeekday(item) === 14,
        item => this.materials.getWeekday(item) === 25,
        item => this.materials.getWeekday(item) === 36,
      ]));
  }
}
