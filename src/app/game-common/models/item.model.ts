import {Rarity} from './rarity.type';

export interface Item<T> {
  info: ItemInfo<T>;

  progress: ItemProgress<T>;

  plan: ItemPlan<T>;
}

export interface ItemInfo<T> {
  id: number;

  rarity: Rarity;
}

export interface ItemProgress<T> {
  id: number;
}

export interface ItemPlan<T> {
  id: number;
}
