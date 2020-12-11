import {Component, OnInit} from '@angular/core';
import {CommonMaterialsService} from '../../../shared/services/common-materials.service';
import {Observable} from 'rxjs';
import {Rarity} from '../../../shared/models/rarity.enum';

@Component({
  selector: 'app-inventory-common-materials',
  templateUrl: './inventory-common-materials.component.html',
  styleUrls: ['./inventory-common-materials.component.sass']
})
export class InventoryCommonMaterialsComponent implements OnInit {

  characterExps: { id: number, rarity: Rarity }[] = [];

  weaponExps: { id: number, rarity: Rarity }[] = [];

  ores: { id: number, rarity: Rarity }[] = [];

  constructor(private materials: CommonMaterialsService) {
  }

  ngOnInit(): void {
    this.initData(this.materials.characterExps, (data) => this.characterExps = data.reverse());
    this.initData(this.materials.weaponExps, (data) => this.weaponExps = data.reverse());
    this.initData(this.materials.ores, (data) => this.ores = data);
  }

  initData<T extends { [id: number]: any }>(observable: Observable<T>, setData: (data: { id: number, rarity: Rarity }[]) => void): void {
    observable.subscribe(data => {
      const ids = Object.keys(data).map(Number);
      const items = ids.map(i => ({id: i, rarity: data[i].rarity || 1}));
      setData(items);
    });
  }

}
