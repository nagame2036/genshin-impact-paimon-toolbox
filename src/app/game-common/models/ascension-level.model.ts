import {Ascension} from './ascension.type';

export interface AscensionLevel {
  ascension: Ascension;

  level: number;
}

export interface AscensionLevelData extends AscensionLevel {
  ascensionRange: [Ascension, Ascension];

  levelRange: [number, number];
}
