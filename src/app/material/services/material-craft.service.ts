import {Injectable} from '@angular/core';
import {CraftRecipe, MaterialDetail} from '../models/material.model';
import {MaterialList} from '../collections/material-list';

@Injectable({
  providedIn: 'root',
})
export class MaterialCraftService {
  constructor() {}

  isCraftable(
    target: MaterialDetail,
    materials: Map<number, MaterialDetail>,
  ): boolean {
    for (const recipe of target.info.recipes ?? []) {
      const every = Object.entries(recipe).every(([itemId, itemAmount]) => {
        const itemHave = materials.get(Number(itemId))?.have ?? 0;
        return itemHave >= itemAmount;
      });
      if (every) {
        return true;
      }
    }
    return false;
  }

  getCraftDetails(
    item: MaterialDetail,
    materials: Map<number, MaterialDetail>,
  ): {usage: MaterialDetail[]; craftableAmount: number}[] {
    if (!item.info.recipes) {
      return [];
    }
    const result: {usage: MaterialDetail[]; craftableAmount: number}[] = [];
    for (const recipe of item.info.recipes) {
      const usage: MaterialDetail[] = [];
      let craftableAmount = Infinity;
      for (const [itemId, itemAmount] of Object.entries(recipe)) {
        const recipeMaterial = materials.get(Number(itemId));
        if (!recipeMaterial) {
          continue;
        }
        usage.push(recipeMaterial);
        const itemHave = recipeMaterial.have ?? 0;
        const itemCanCraft = Math.floor(itemHave / itemAmount);
        if (itemCanCraft < craftableAmount) {
          craftableAmount = itemCanCraft;
        }
      }
      result.push({usage, craftableAmount});
    }
    return result;
  }

  craft(id: number, recipe: CraftRecipe, performedTimes: number): MaterialList {
    const change = new MaterialList();
    if (performedTimes <= 0) {
      return change;
    }
    for (const [itemIdString, itemAmount] of Object.entries(recipe)) {
      const itemCost = itemAmount * performedTimes;
      change.change(Number(itemIdString), -itemCost);
    }
    return change.change(id, performedTimes);
  }
}
