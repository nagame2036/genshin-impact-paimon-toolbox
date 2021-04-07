import {Rarity} from './rarity.type';
import {ExpBonus} from './levelup-exp-bonus.model';

export interface Item<T> {
  info: ItemInfo<T>;

  progress: ItemProgress<T>;

  plan: ItemPlan<T>;
}

export interface ItemInfo<T> {
  id: number;

  rarity: Rarity;

  /**
   * Exp bonus when level-up.
   */
  expBonus?: ExpBonus[];
}

export interface ItemProgress<T> {
  id: number;
}

export interface ItemPlan<T> {
  id: number;
}
