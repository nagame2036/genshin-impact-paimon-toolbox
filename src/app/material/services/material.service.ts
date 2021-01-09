import {Injectable} from '@angular/core';
import {combineLatest, ReplaySubject} from 'rxjs';
import {InventoryItem} from '../models/inventory-item.model';
import {CharacterExpMaterialService} from './character-exp-material.service';
import {WeaponExpMaterialService} from './weapon-exp-material.service';
import {ElementalMaterialService} from './elemental-material.service';
import {TalentMaterialService} from './talent-material.service';
import {WeaponMaterialService} from './weapon-material.service';
import {CommonMaterialService} from './common-material.service';
import {OreMaterialService} from './ore-material.service';
import {LocalSpecialtyService} from './local-specialty.service';
import {characterExp, mora, weaponExp} from '../models/mora-and-exp.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  #materials = new ReplaySubject<InventoryItem[]>();

  readonly materials = this.#materials.asObservable();

  constructor(private characterExps: CharacterExpMaterialService, private weaponExps: WeaponExpMaterialService,
              private ores: OreMaterialService, private elemental: ElementalMaterialService, private talents: TalentMaterialService,
              private weapons: WeaponMaterialService, private common: CommonMaterialService, private local: LocalSpecialtyService) {
    this.loadMaterials();
  }

  private loadMaterials(): void {
    combineLatest([this.characterExps.items, this.weaponExps.items, this.ores.items, this.elemental.items, this.talents.items,
      this.weapons.items, this.common.items, this.local.items]).subscribe(materials => {
      const totalMaterials = [mora, characterExp, weaponExp];
      for (const list of materials) {
        for (const item of list) {
          totalMaterials.push(item);
        }
      }
      this.#materials.next(totalMaterials);
    });
  }
}
