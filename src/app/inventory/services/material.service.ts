import {Injectable} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {InventoryItem} from '../models/inventory-item.model';
import {CharacterExpMaterialService} from './character-exp-material.service';
import {WeaponExpMaterialService} from './weapon-exp-material.service';
import {CharacterAscensionMaterialService} from './character-ascension-material.service';
import {TalentLevelupMaterialService} from './talent-levelup-material.service';
import {WeaponAscensionMaterialService} from './weapon-ascension-material.service';
import {EnemiesMaterialService} from './enemies-material.service';
import {OreMaterialService} from './ore-material.service';
import {LocalSpecialtyService} from './local-specialty.service';
import {characterExp, mora, weaponExp} from '../models/mora-and-exp.model';
import {MaterialType} from '../models/material-type.enum';
import {first, map, tap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {InventoryItemDetail} from '../models/inventory-item-detail.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  #materials = new ReplaySubject<InventoryItem[]>();

  readonly materials = this.#materials.asObservable();

  #materialsMap = new ReplaySubject<Map<number, InventoryItem[]>>();

  constructor(private characterExps: CharacterExpMaterialService, private weaponExps: WeaponExpMaterialService,
              private ores: OreMaterialService, private characters: CharacterAscensionMaterialService,
              private talents: TalentLevelupMaterialService, private weapons: WeaponAscensionMaterialService,
              private enemies: EnemiesMaterialService, private local: LocalSpecialtyService,
              private logger: NGXLogger) {
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
      }),
      tap(materials => this.logger.info('sent materials', types, materials)),
    );
  }

  processSpecialDetails(details: Map<number, InventoryItemDetail>): Map<number, InventoryItemDetail> {
    this.characterExps.processExpDetails(details);
    this.weaponExps.processExpDetails(details);
    return details;
  }

  private loadMaterials(): void {
    combineLatest([this.characterExps.items, this.weaponExps.items, this.ores.items, this.characters.items, this.talents.items,
      this.weapons.items, this.enemies.items, this.local.items]).subscribe(materials => {
      const totalMaterials = [mora, characterExp, weaponExp];
      for (const list of materials) {
        for (const item of list) {
          totalMaterials.push(item);
        }
      }
      this.logger.info('loaded materials', totalMaterials);
      this.#materials.next(totalMaterials);
    });
  }

  private mapMaterials(): void {
    this.materials.subscribe(materials => {
      this.#materialsMap.next(mapTypes(materials, [
        [MaterialType.CURRENCY, it => it.id < 100],
        [MaterialType.CHARACTER_EXP, it => it.id < 200],
        [MaterialType.WEAPON_EXP, it => it.id < 300],
        [MaterialType.ORE, it => it.id < 2000],
        [MaterialType.CHARACTER_BOSS, it => it.id < 3000],
        [MaterialType.CHARACTER_GEM, it => it.id < 4000],
        [MaterialType.WEAPON_14, it => it.id < 5000 && this.weapons.getWeekday(it) === 147],
        [MaterialType.WEAPON_25, it => it.id < 5000 && this.weapons.getWeekday(it) === 257],
        [MaterialType.WEAPON_36, it => it.id < 5000 && this.weapons.getWeekday(it) === 367],
        [MaterialType.TALENT_14, it => it.id < 6000 && this.talents.getWeekday(it) === 147],
        [MaterialType.TALENT_25, it => it.id < 6000 && this.talents.getWeekday(it) === 257],
        [MaterialType.TALENT_36, it => it.id < 6000 && this.talents.getWeekday(it) === 367],
        [MaterialType.TALENT_COMMON, it => it.id < 8000],
        [MaterialType.ENEMY_MOB, it => it.id < 9000],
        [MaterialType.ENEMY_ELITE, it => it.id < 10000],
        [MaterialType.LOCAL_SPECIALTY, it => it.id < 11000],
      ]));
    });
  }
}

function mapTypes(list: InventoryItem[], parts: [MaterialType, (item: InventoryItem) => boolean][]): Map<MaterialType, InventoryItem[]> {
  const result = new Map<MaterialType, InventoryItem[]>();
  const distinct = new Map<number, number>();
  for (const [type, condition] of parts) {
    const materials = [];
    for (const item of list) {
      const id = item.id;
      if (!distinct.has(id) && condition(item)) {
        materials.push(item);
        distinct.set(id, id);
      }
    }
    result.set(type, materials);
  }
  return result;
}
