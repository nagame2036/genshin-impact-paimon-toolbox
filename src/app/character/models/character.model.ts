import {CharacterInfo} from './character-info.model';
import {CharacterProgress} from './character-progress.model';
import {CharacterPlan} from './character-plan.model';

/**
 * Represents the details of a character.
 */
export interface Character {

  info: CharacterInfo;

  progress: CharacterProgress;

  plan: CharacterPlan;
}
