import {Injectable} from '@angular/core';
import {CraftRecipe, MaterialDetail} from '../models/material.model';
import {mapArrays} from '../../shared/utils/collections';
import {mora} from '../models/mora-and-exp.model';
import {MaterialList} from '../models/material-list.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialCraftService {

  constructor() {
  }

  getCraftableAmount(target: MaterialDetail, needCraft: number, materials: Map<number, MaterialDetail>): number {
    if (needCraft <= 0) {
      return 0;
    }
    if (!target.recipe) {
      return 0;
    }
    let craftableAmount = -1;
    const recipe = getRecipeDetails(target.recipe, materials);
    for (const [item, itemAmount] of recipe) {
      const itemRequired = needCraft * itemAmount + item.need - item.have - item.craftable;
      item.craftable = this.getCraftableAmount(item, itemRequired, materials);
      let itemRemaining = item.have + item.craftable;

      // avoid item remaining <= 0 when mora have <= mora need
      if (item.id !== mora.id) {
        itemRemaining -= item.need + item.craftUsed;
      }
      if (itemRemaining <= 0) {
        return 0;
      }
      const performableTimes = Math.floor(itemRemaining / itemAmount);
      if (craftableAmount === -1 || performableTimes < craftableAmount) {
        craftableAmount = performableTimes;
      }
    }
    craftableAmount = Math.min(craftableAmount, needCraft);
    recipe.forEach(([item, itemAmount]) => item.craftUsed += itemAmount * craftableAmount);
    return craftableAmount;
  }

  craft(target: MaterialDetail, performedTimes: number, materials: Map<number, MaterialDetail>, craftChange: MaterialList): MaterialList {
    if (performedTimes <= 0) {
      return craftChange;
    }
    if (!target.recipe) {
      return craftChange;
    }
    const recipe = getRecipeDetails(target.recipe, materials);
    for (const [item, itemAmount] of recipe) {
      const {id: itemId, have: itemHave} = item;
      const itemNeed = itemAmount * performedTimes;
      const itemCost = Math.min(itemHave, itemNeed);
      craftChange.change(itemId, -itemCost);
      item.craftUsed -= itemCost;
      const remainingNeed = itemNeed - itemHave;
      if (remainingNeed > 0) {
        this.craft(item, remainingNeed, materials, craftChange);
      }
    }
    return craftChange.change(target.id, performedTimes);
  }
}

function getRecipeDetails(recipe: CraftRecipe, materials: Map<number, MaterialDetail>): [MaterialDetail, number][] {
  return mapArrays(Object.entries(recipe), materials, it => Number(it[0]), (it, material) => [material, it[1]]);
}
