export interface TalentInfo {

  id: number;

  materials?: TalentMaterialRequirements;
}

export interface TalentMaterialRequirements {

  /**
   * The travelers repeatedly use 3 types of talent domain materials for leveling up their talents,
   * and other character use 1 type.
   */
  domain: number[];

  mob: number;

  boss: number;

  event: number;
}

export type TalentLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
