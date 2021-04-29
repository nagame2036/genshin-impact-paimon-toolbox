import {MaterialDetail} from './material.model';

/**
 * Item id to amount.
 */
export type CraftRecipe = Record<number, number>;

export type CraftDetail = {usage: MaterialDetail[]; craftableAmount: number};
