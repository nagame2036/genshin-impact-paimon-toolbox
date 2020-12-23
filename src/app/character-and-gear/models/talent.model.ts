export interface TalentData {

  groups: TalentDataGroup[];

  items: TalentDataItem[];
}

export interface TalentDataGroup {

  id: number;

  /**
   * The travelers repeatedly use 3 types of talent domain materials for leveling up their talents,
   * and other character use 1 type.
   */
  domain: number[];

  common: number;

  boss: number;

  event: number;
}

export interface TalentDataItem {

  id: number;

  /**
   * Id of character.
   */
  character: number;

  /**
   * Talent
   */
  group: number;

  /**
   * Defined when this talent is available for leveling up.
   */
  level?: number;
}
