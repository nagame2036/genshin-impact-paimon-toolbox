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
import {partitionArrays} from '../../shared/utils/collections';
import {MaterialType} from '../models/material-type.enum';
import {first, map, tap} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';

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
      const [currency, characterExps, weaponExps, ores, characterBoss, characterGem, weapons14, weapons25, weapons36,
        talents14, talents25, talents36, talentsCommon, mob, elite, localSpecialties] = partitionArrays(materials, [
        it => it.id < 100,
        it => it.id < 200,
        it => it.id < 300,
        it => it.id < 2000,
        it => it.id < 3000,
        it => it.id < 4000,
        it => it.id < 5000 && this.weapons.getWeekday(it) === 147,
        it => it.id < 5000 && this.weapons.getWeekday(it) === 257,
        it => it.id < 5000 && this.weapons.getWeekday(it) === 367,
        it => it.id < 6000 && this.talents.getWeekday(it) === 147,
        it => it.id < 6000 && this.talents.getWeekday(it) === 257,
        it => it.id < 6000 && this.talents.getWeekday(it) === 367,
        it => it.id < 8000,
        it => it.id < 9000,
        it => it.id < 10000,
        it => it.id < 11000,
      ]);
      this.#materialsMap.next(new Map<number, InventoryItem[]>([
        [MaterialType.CURRENCY, currency],
        [MaterialType.CHARACTER_EXP, characterExps],
        [MaterialType.WEAPON_EXP, weaponExps],
        [MaterialType.ORE, ores],
        [MaterialType.CHARACTER_BOSS, characterBoss],
        [MaterialType.CHARACTER_GEM, characterGem],
        [MaterialType.WEAPON_14, weapons14],
        [MaterialType.WEAPON_25, weapons25],
        [MaterialType.WEAPON_36, weapons36],
        [MaterialType.TALENT_14, talents14],
        [MaterialType.TALENT_25, talents25],
        [MaterialType.TALENT_36, talents36],
        [MaterialType.TALENT_COMMON, talentsCommon],
        [MaterialType.ENEMY_MOB, mob],
        [MaterialType.ENEMY_ELITE, elite],
        [MaterialType.LOCAL_SPECIALTY, localSpecialties],
      ]));
    });
  }
}
