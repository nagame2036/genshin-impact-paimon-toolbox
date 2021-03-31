import {Injectable} from '@angular/core';
import {MaterialDetail, MaterialInfo} from '../models/material.model';
import {characterExp, mora, weaponExp} from '../models/mora-and-exp.model';
import {MaterialType} from '../models/material-type.enum';
import characterExpMaterials from '../../../data/materials/character-exps.json';
import weaponExpMaterials from '../../../data/materials/weapon-exps.json';
import oreMaterials from '../../../data/materials/ore-materials.json';
import characterAscendMaterials from '../../../data/materials/character-ascend-materials.json';
import weaponAscendMaterials from '../../../data/materials/weapon-ascend-materials.json';
import talentLevelupMaterials from '../../../data/materials/talent-levelup-materials.json';
import enemyMaterials from '../../../data/materials/enemy-materials.json';
import localSpecialtyMaterials from '../../../data/materials/local-specialties.json';
import {processExpMaterials, processExpRequirement} from '../utils/exp-details';
import {MaterialRequireList} from '../collections/material-require-list';
import {RequireMark} from '../models/material-require-mark.model';
import {MaterialGroupCost} from '../models/material-group-cost.model';

type WeekdayGroup = {[group: number]: {weekday?: number}};

@Injectable({
  providedIn: 'root',
})
export class MaterialInfoService {
  readonly typed = new Map<MaterialType, MaterialInfo[]>();

  readonly grouped = new Map<number, MaterialInfo[]>();

  readonly ignoreGroupTypes = [
    MaterialType.TALENT_COMMON,
    MaterialType.LOCAL_SPECIALTY,
  ];

  constructor() {
    this.initTyped();
    this.initGrouped();
  }

  processSpecialMaterials(materials: Map<number, MaterialDetail>): void {
    processExpMaterials(characterExpMaterials, materials);
    processExpMaterials(weaponExpMaterials, materials);
  }

  processSpecialRequirement(req: MaterialRequireList, mark: RequireMark): void {
    processExpRequirement(characterExpMaterials, req, mark);
    processExpRequirement(weaponExpMaterials, req, mark);
  }

  markGroup(
    list: MaterialRequireList,
    groupId: number,
    {rarity, amount}: MaterialGroupCost,
    mark: RequireMark,
  ): void {
    const grouped = this.grouped.get(groupId) ?? [];
    const index = grouped?.findIndex(it => it.rarity === rarity);
    const material = grouped[index];
    if (material) {
      list.mark(material.id, amount, mark);
    }
  }

  private initTyped(): void {
    this.typed.set(MaterialType.CURRENCY, [mora]);

    const characterExps = characterExpMaterials as MaterialInfo[];
    this.typed.set(MaterialType.CHARACTER_EXP, [
      characterExp,
      ...characterExps,
    ]);

    const weaponExps = weaponExpMaterials as MaterialInfo[];
    this.typed.set(MaterialType.WEAPON_EXP, [weaponExp, ...weaponExps]);

    const ores = oreMaterials as MaterialInfo[];
    this.typed.set(MaterialType.ORE, ores);

    const characterAscends = characterAscendMaterials.items as MaterialInfo[];
    this.setTyped(characterAscends, [
      [MaterialType.CHARACTER_BOSS, it => it.id < 3000],
      [MaterialType.CHARACTER_GEM, it => it.id < 4000],
    ]);

    const weaponAscends = weaponAscendMaterials.items as MaterialInfo[];
    const weaponAscendGroups = weaponAscendMaterials.groups as WeekdayGroup;
    this.setTyped(weaponAscends, [
      [MaterialType.WEAPON_147, it => isWeekday(weaponAscendGroups, it, 147)],
      [MaterialType.WEAPON_257, it => isWeekday(weaponAscendGroups, it, 257)],
      [MaterialType.WEAPON_367, it => isWeekday(weaponAscendGroups, it, 367)],
    ]);

    const talentLevelups = talentLevelupMaterials.items as MaterialInfo[];
    const talentLevelupGroups = talentLevelupMaterials.groups as WeekdayGroup;
    this.setTyped(talentLevelups, [
      [MaterialType.TALENT_147, it => isWeekday(talentLevelupGroups, it, 147)],
      [MaterialType.TALENT_257, it => isWeekday(talentLevelupGroups, it, 257)],
      [MaterialType.TALENT_367, it => isWeekday(talentLevelupGroups, it, 367)],
      [MaterialType.TALENT_COMMON, it => it.id < 8000],
    ]);

    const enemies = enemyMaterials.items as MaterialInfo[];
    this.setTyped(enemies, [
      [MaterialType.ENEMY_MOB, it => it.id < 9000],
      [MaterialType.ENEMY_ELITE, it => it.id < 10000],
    ]);

    const localSpecialties = localSpecialtyMaterials.items as MaterialInfo[];
    this.typed.set(MaterialType.LOCAL_SPECIALTY, localSpecialties);
  }

  private setTyped(
    list: MaterialInfo[],
    parts: [MaterialType, (item: MaterialInfo) => boolean][],
  ): void {
    for (const item of list) {
      for (const [type, condition] of parts) {
        if (condition(item)) {
          const materials = this.typed.get(type) ?? [];
          materials.push(item);
          this.typed.set(type, materials);
          break;
        }
      }
    }
  }

  private initGrouped(): void {
    for (const typed of this.typed.values()) {
      for (const material of typed) {
        const group = material.group;
        if (group) {
          const materials = this.grouped.get(group) ?? [];
          materials.push(material);
          this.grouped.set(group, materials);
        }
      }
    }
  }
}

function isWeekday(
  groups: WeekdayGroup,
  material: MaterialInfo,
  weekday: number,
): boolean {
  const group = material.group;
  return group ? groups[group]?.weekday === weekday : false;
}
