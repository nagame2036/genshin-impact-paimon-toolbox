export type TalentInfo = BaseTalentInfo | UpgradableTalentInfo;

interface BaseTalentInfo {
  id: number;
}

export interface UpgradableTalentInfo extends BaseTalentInfo {
  materials: TalentMaterialRequirements;
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

export const baseTalentLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const extraTalentLevels = [11, 12, 13, 14, 15] as const;

export const allTalentLevels = [...baseTalentLevels, ...extraTalentLevels] as const;

export type TalentLevel = typeof allTalentLevels[number];
