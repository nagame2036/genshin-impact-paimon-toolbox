import {InventoryItemDetail} from '../../material/models/inventory-item-detail.model';
import {mora} from '../../material/models/mora-and-exp.model';
import {ItemList} from '../../material/models/item-list.model';
import {CraftRecipe} from '../../material/models/craft-recipe.model';
import {mapArrays} from '../../shared/utils/collections';

export function getCraftableAmount(detail: InventoryItemDetail, needCraft: number, details: Map<number, InventoryItemDetail>): number {
  if (needCraft <= 0) {
    return 0;
  }
  if (!detail.recipe) {
    return 0;
  }
  let craftableAmount = -1;
  const recipe = getRecipe(detail.recipe, details);
  for (const [item, itemAmount] of recipe) {
    const itemRequired = needCraft * itemAmount + item.need - item.have - item.craftable;
    item.craftable = getCraftableAmount(item, itemRequired, details);
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
  recipe.forEach(([item, amount]) => item.craftUsed += amount * craftableAmount);
  return craftableAmount;
}

export function craftItem(detail: InventoryItemDetail, performedTimes: number, details: Map<number, InventoryItemDetail>): ItemList {
  const change = new ItemList();
  if (performedTimes <= 0) {
    return change;
  }
  if (!detail.recipe) {
    return change;
  }
  for (const [item, amount] of getRecipe(detail.recipe, details)) {
    const itemCraftNeed = amount * performedTimes;
    const have = item.have;
    if (have >= itemCraftNeed) {
      change.change(item.id, -itemCraftNeed);
      item.craftUsed -= itemCraftNeed;
      continue;
    }
    change.change(item.id, -have);
    item.craftUsed -= have;
    const remainingCraftNeed = itemCraftNeed - have;
    change.combine(craftItem(item, remainingCraftNeed, details));
  }
  return change.change(detail.id, performedTimes);
}

function getRecipe(recipe: CraftRecipe, details: Map<number, InventoryItemDetail>): [InventoryItemDetail, number][] {
  return mapArrays(Object.entries(recipe), details, it => Number(it[0]), (it, detail) => [detail, it[1]]);
}
