import {CharacterInfo} from './character-info.model';
import {CharacterProgress} from './character-progress.model';
import {CharacterPlan} from './character-plan.model';
import {CharacterStatsValue} from './character-stats.model';
import {Item} from '../../game-common/models/item.model';

/**
 * Represents the details of a character.
 */
export interface Character extends Item<Character> {
  info: CharacterInfo;

  progress: CharacterProgress;

  plan: CharacterPlan;
}

export interface CharacterOverview extends Character {
  currentStats: CharacterStatsValue;

  planStats: CharacterStatsValue;
}
