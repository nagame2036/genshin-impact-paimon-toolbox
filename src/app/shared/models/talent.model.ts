export interface TalentData {

  groups: TalentDataGroup[];

  items: TalentDataItem[];
}

export interface TalentDataGroup {

  id: number;

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
   * Is talent can level up.
   */
  level: boolean;
}
