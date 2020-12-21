import {Component, OnInit} from '@angular/core';
import {WeaponMaterialItem} from '../../../material/models/weapon-material';
import {WeaponMaterialService} from '../../../material/services/weapon-material.service';

@Component({
  selector: 'app-weapon-material-inventory',
  templateUrl: './weapon-material-inventory.component.html',
  styleUrls: ['./weapon-material-inventory.component.sass']
})
export class WeaponMaterialInventoryComponent implements OnInit {

  items: WeaponMaterialItem[] = [];

  constructor(private materials: WeaponMaterialService) {
  }

  ngOnInit(): void {
    this.materials.items.subscribe(res => this.items = res);
  }

}
