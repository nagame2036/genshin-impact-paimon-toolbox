import {Component, OnInit} from '@angular/core';
import {ElementalMaterialService} from '../../../material/services/elemental-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {characterExp} from '../../../material/models/mora-and-exp.model';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';
import {partitionArrays} from '../../../shared/utils/collections';
import {AbstractSubInventoryComponent} from '../abstract-sub-inventory.component';

@Component({
  selector: 'app-character-material-inventory',
  templateUrl: './character-material-inventory.component.html',
  styleUrls: ['./character-material-inventory.component.sass']
})
export class CharacterMaterialInventoryComponent extends AbstractSubInventoryComponent implements OnInit {

  common: InventoryItem[] = [];

  elements: InventoryItem[] = [];

  gems: InventoryItem[] = [];

  rarities = [5, 4, 3, 2];

  constructor(private exps: CharacterExpMaterialService, private materials: ElementalMaterialService) {
    super();
  }

  ngOnInit(): void {
    this.filterItems(this.exps.items)
      .subscribe(items => this.common = [characterExp, ...items]);
    this.filterItems(this.materials.items)
      .subscribe(items => [this.elements, this.gems] = partitionArrays(items, [item => item.id < 3000]));
  }
}
