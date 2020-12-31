import {Component, OnInit} from '@angular/core';
import {ElementalMaterialService} from '../../../material/services/elemental-material.service';
import {InventoryItem} from '../../../material/models/inventory-item.model';
import {combineLatest} from 'rxjs';
import {characterExp} from '../../../material/models/mora-and-exp.model';
import {CharacterExpMaterialService} from '../../../material/services/character-exp-material.service';
import {partitionArrays} from '../../../shared/utils/collections';
import {AbstractTranslateComponent} from '../../../shared/components/abstract-translate.component';

@Component({
  selector: 'app-character-material-inventory',
  templateUrl: './character-material-inventory.component.html',
  styleUrls: ['./character-material-inventory.component.sass']
})
export class CharacterMaterialInventoryComponent extends AbstractTranslateComponent implements OnInit {

  i18nKey = 'inventory';

  expMaterials: InventoryItem[] = [];

  elements: InventoryItem[] = [];

  gems: InventoryItem[] = [];

  constructor(private exps: CharacterExpMaterialService, private materials: ElementalMaterialService) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.exps.items, this.materials.items])
      .subscribe(([exps, materials]) => {
        this.expMaterials = [characterExp, ...exps];
        const [elements, gems] = partitionArrays(materials, [item => item.id < 3000]);
        this.elements = elements;
        this.gems = gems;
      });
  }
}
