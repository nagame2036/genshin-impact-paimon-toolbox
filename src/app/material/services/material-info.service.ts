import {Injectable} from '@angular/core';
import {CharacterExpMaterialService} from './character-exp-material.service';
import {WeaponExpMaterialService} from './weapon-exp-material.service';
import {OreMaterialService} from './ore-material.service';
import {CharacterAscensionMaterialService} from './character-ascension-material.service';
import {TalentLevelupMaterialService} from './talent-levelup-material.service';
import {WeaponAscensionMaterialService} from './weapon-ascension-material.service';
import {EnemyMaterialService} from './enemy-material.service';
import {LocalSpecialtyService} from './local-specialty.service';
import {NGXLogger} from 'ngx-logger';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {MaterialDetail, MaterialInfo} from '../models/material.model';
import {characterExp, mora, weaponExp} from '../models/mora-and-exp.model';
import {MaterialType} from '../models/material-type.enum';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaterialInfoService {

  private materials$ = new ReplaySubject<Map<number, MaterialInfo[]>>();

  constructor(private characterExpMaterials: CharacterExpMaterialService, private weaponExpMaterials: WeaponExpMaterialService,
              private oreMaterials: OreMaterialService, private characterMaterials: CharacterAscensionMaterialService,
              private talentMaterials: TalentLevelupMaterialService, private weaponMaterials: WeaponAscensionMaterialService,
              private enemyMaterials: EnemyMaterialService, private localSpecialties: LocalSpecialtyService,
              private logger: NGXLogger) {
    this.loadMaterials();
  }

  getAll(): Observable<Map<number, MaterialInfo[]>> {
    return this.materials$.pipe(
      tap(materials => this.logger.info('sent all information of materials', materials)),
    );
  }

  processSpecialMaterials(materials: Map<number, MaterialDetail>): void {
    this.characterExpMaterials.processExpMaterials(materials);
    this.weaponExpMaterials.processExpMaterials(materials);
  }

  private loadMaterials(): void {
    combineLatest([this.characterExpMaterials.items, this.weaponExpMaterials.items, this.oreMaterials.items,
      this.characterMaterials.items, this.talentMaterials.items, this.weaponMaterials.items, this.enemyMaterials.items,
      this.localSpecialties.items])
      .subscribe(([characterExps, weaponExps, ores,
                    characters, talents, weapons,
                    enemies, local]) => {
        const materials = new Map<number, MaterialInfo[]>([
          [MaterialType.CURRENCY, [mora]],
          [MaterialType.CHARACTER_EXP, [characterExp, ...characterExps]],
          [MaterialType.WEAPON_EXP, [weaponExp, ...weaponExps]],
          [MaterialType.ORE, ores],
          ...mapTypes(characters, [
            [MaterialType.CHARACTER_BOSS, it => it.id < 3000],
            [MaterialType.CHARACTER_GEM, it => it.id < 4000],
          ]),
          ...mapTypes(weapons, [
            [MaterialType.WEAPON_14, it => this.weaponMaterials.getWeekday(it) === 147],
            [MaterialType.WEAPON_25, it => this.weaponMaterials.getWeekday(it) === 257],
            [MaterialType.WEAPON_36, it => this.weaponMaterials.getWeekday(it) === 367],
          ]),
          ...mapTypes(talents, [
            [MaterialType.TALENT_14, it => this.talentMaterials.getWeekday(it) === 147],
            [MaterialType.TALENT_25, it => this.talentMaterials.getWeekday(it) === 257],
            [MaterialType.TALENT_36, it => this.talentMaterials.getWeekday(it) === 367],
            [MaterialType.TALENT_COMMON, it => it.id < 8000],
          ]),
          ...mapTypes(enemies, [
            [MaterialType.ENEMY_MOB, it => it.id < 9000],
            [MaterialType.ENEMY_ELITE, it => it.id < 10000],
          ]),
          [MaterialType.LOCAL_SPECIALTY, local],
        ]);
        this.logger.info('loaded materials', materials);
        this.materials$.next(materials);
      });
  }
}

function mapTypes(list: MaterialInfo[], parts: [MaterialType, (item: MaterialInfo) => boolean][]): Map<MaterialType, MaterialInfo[]> {
  const result = new Map<MaterialType, MaterialInfo[]>();
  for (const item of list) {
    for (const [type, condition] of parts) {
      if (condition(item)) {
        const materials = result.get(type) ?? [];
        materials.push(item);
        result.set(type, materials);
        break;
      }
    }
  }
  return result;
}
