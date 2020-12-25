export class ItemCostList {

  /**
   * item's id to it's amount.
   */
  [id: number]: number;

  add(id: number, amount: number): ItemCostList {
    this[id] ??= 0;
    this[id] += amount;
    return this;
  }

  combine(that: ItemCostList): ItemCostList {
    for (const id in that) {
      if (that.hasOwnProperty(id)) {
        this[id] ??= 0;
        this[id] += that[id];
      }
    }
    return this;
  }
}
