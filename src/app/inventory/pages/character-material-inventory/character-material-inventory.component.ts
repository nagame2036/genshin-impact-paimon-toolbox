import {Component, OnInit} from '@angular/core';
import {ElementalMaterialService} from '../../../material/services/elemental-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {combineLatest} from 'rxjs';
import {characterExp} from '../../../material/models/mora-and-exp.model';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';

@Component({
  selector: 'app-character-material-inventory',
  templateUrl: './character-material-inventory.component.html',
  styleUrls: ['./character-material-inventory.component.sass']
})
export class CharacterMaterialInventoryComponent implements OnInit {

  items: InventoryItem[] = [];

  constructor(private exps: CharacterExpMaterialService, private materials: ElementalMaterialService) {
  }

  ngOnInit(): void {
    combineLatest([this.exps.items, this.materials.items])
      .subscribe(([exps, materials]) => {
        this.items = [characterExp, ...exps, ...materials];
      });
  }
}
