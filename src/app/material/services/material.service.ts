import {Injectable} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {InventoryItem} from '../models/inventory-item.model';
import {CharacterExpMaterialService} from './character-exp-material.service';
import {WeaponExpMaterialService} from './weapon-exp-material.service';
import {CharacterMaterialService} from './character-material.service';
import {TalentMaterialService} from './talent-material.service';
import {WeaponMaterialService} from './weapon-material.service';
import {CommonMaterialService} from './common-material.service';
import {OreMaterialService} from './ore-material.service';
import {LocalSpecialtyService} from './local-specialty.service';
import {characterExp, mora, weaponExp} from '../models/mora-and-exp.model';
import {partitionArrays} from '../../shared/utils/collections';
import {MaterialType} from '../models/material-type.enum';
import {first, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  #materials = new ReplaySubject<InventoryItem[]>();

  readonly materials = this.#materials.asObservable();

  #materialsMap = new ReplaySubject<Map<number, InventoryItem[]>>();

  constructor(private characterExps: CharacterExpMaterialService, private weaponExps: WeaponExpMaterialService,
              private ores: OreMaterialService, private characters: CharacterMaterialService, private talents: TalentMaterialService,
              private weapons: WeaponMaterialService, private common: CommonMaterialService, private local: LocalSpecialtyService) {
    this.loadMaterials();
    this.mapMaterials();
  }

  getMaterials(...types: MaterialType[]): Observable<InventoryItem[]> {
    return this.#materialsMap.pipe(
      first(),
      map(materials => {
        const results: InventoryItem[] = [];
        for (const type of types) {
          const items = materials.get(type) ?? [];
          results.push(...items);
        }
        return results;
      })
    );
  }

  private loadMaterials(): void {
    combineLatest([this.characterExps.items, this.weaponExps.items, this.ores.items, this.characters.items, this.talents.items,
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

  private mapMaterials(): void {
    this.materials.subscribe(materials => {
      const [currency, characterExps, weaponExps, ores, characterBoss, characterGem, weapons14, weapons25, weapons36,
        talents14, talents25, talents36, talentsCommon, commonMob, commonElite, localSpecialties] = partitionArrays(materials, [
        it => it.id < 100,
        it => it.id < 200,
        it => it.id < 300,
        it => it.id < 2000,
        it => it.id < 3000,
        it => it.id < 4000,
        it => it.id < 5000 && this.weapons.getWeekday(it) === 14,
        it => it.id < 5000 && this.weapons.getWeekday(it) === 25,
        it => it.id < 5000 && this.weapons.getWeekday(it) === 36,
        it => it.id < 6000 && this.talents.getWeekday(it) === 14,
        it => it.id < 6000 && this.talents.getWeekday(it) === 25,
        it => it.id < 6000 && this.talents.getWeekday(it) === 36,
        it => it.id < 8000,
        it => it.id < 9000,
        it => it.id < 10000,
        it => it.id < 11000,
      ]);
      const materialsMap = new Map<number, InventoryItem[]>();
      materialsMap.set(MaterialType.CURRENCY, currency);
      materialsMap.set(MaterialType.CHARACTER_EXP, characterExps);
      materialsMap.set(MaterialType.WEAPON_EXP, weaponExps);
      materialsMap.set(MaterialType.ORE, ores);
      materialsMap.set(MaterialType.CHARACTER_BOSS, characterBoss);
      materialsMap.set(MaterialType.CHARACTER_GEM, characterGem);
      materialsMap.set(MaterialType.WEAPON_14, weapons14);
      materialsMap.set(MaterialType.WEAPON_25, weapons25);
      materialsMap.set(MaterialType.WEAPON_36, weapons36);
      materialsMap.set(MaterialType.TALENT_14, talents14);
      materialsMap.set(MaterialType.TALENT_25, talents25);
      materialsMap.set(MaterialType.TALENT_36, talents36);
      materialsMap.set(MaterialType.TALENT_COMMON, talentsCommon);
      materialsMap.set(MaterialType.COMMON_MOB, commonMob);
      materialsMap.set(MaterialType.COMMON_ELITE, commonElite);
      materialsMap.set(MaterialType.LOCAL_SPECIALTY, localSpecialties);
      this.#materialsMap.next(materialsMap);
    });
  }
}
