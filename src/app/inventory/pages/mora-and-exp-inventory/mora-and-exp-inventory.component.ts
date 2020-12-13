import {Component, OnInit} from '@angular/core';
import {InventoryService} from '../../services/inventory.service';
import {InventoryItem} from '../../models/inventory-item';

@Component({
  selector: 'app-mora-and-exp-inventory',
  templateUrl: './mora-and-exp-inventory.component.html',
  styleUrls: ['./mora-and-exp-inventory.component.sass']
})
export class MoraAndExpInventoryComponent implements OnInit {

  characterExps: InventoryItem[] = [];

  weaponExps: InventoryItem[] = [];

  ores: InventoryItem[] = [];

  constructor(private inventory: InventoryService) {
  }

  ngOnInit(): void {
    this.inventory.getItems('character-exp-items').subscribe(res => this.characterExps = res);
    this.inventory.getItems('weapon-exp-items').subscribe(res => this.weaponExps = res);
    this.inventory.getItems('ore-items').subscribe(res => this.ores = res);
  }

}
