import {Injectable} from '@angular/core';
import {MaterialDetail} from '../models/material.model';
import {MaterialList} from '../collections/material-list';
import {CraftDetail, CraftRecipe} from '../models/craft.type';

@Injectable({
  providedIn: 'root',
})
export class MaterialCraftService {
  constructor() {}

  isCraftable(target: MaterialDetail, materials: Map<number, MaterialDetail>): boolean {
    for (const recipe of target.info.recipes ?? []) {
      for (const [id, amount] of Object.entries(recipe)) {
        const have = materials.get(Number(id))?.have ?? 0;
        if (have > amount) {
          return true;
        }
      }
    }
    return false;
  }

  getCraftDetails(item: MaterialDetail, materials: Map<number, MaterialDetail>): CraftDetail[] {
    const result: CraftDetail[] = [];
    for (const recipe of item.info.recipes ?? []) {
      const usage = [];
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
    for (const [itemId, itemAmount] of Object.entries(recipe)) {
      const itemCost = itemAmount * performedTimes;
      change.change(Number(itemId), -itemCost);
    }
    return change.change(id, performedTimes);
  }
}
