import {Component, OnInit} from '@angular/core';
import {WeaponMaterialService} from '../../../material/services/weapon-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {WeaponExpMaterialService} from '../../../material/services/weapon-exp-material.service';
import {combineLatest} from 'rxjs';
import {weaponExp} from '../../../material/models/mora-and-exp.model';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.sass']
})
export class WeaponMaterialInventoryComponent implements OnInit {

  items: InventoryItem[] = [];

  constructor(private exps: WeaponExpMaterialService, private materials: WeaponMaterialService) {
  }

  ngOnInit(): void {
    combineLatest([this.exps.items, this.materials.items])
      .subscribe(([exps, materials]) => {
        this.items = [weaponExp, ...exps, ...materials];
      });
  }
}
