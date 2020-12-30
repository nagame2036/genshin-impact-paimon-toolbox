export class ItemCostList {

  /**
   * item's id to it's amount.
   */
  private map = new Map<number, number>();

  get(id: number): number {
    return this.map.get(id) ?? 0;
  }

  add(id: number, amount: number): ItemCostList {
    this.addAmount(id, amount);
    return this;
  }

  combine(that: ItemCostList): ItemCostList {
    for (const [id, amount] of that.map.entries()) {
      this.addAmount(id, amount);
    }
    return this;
  }

  private addAmount(id: number, amount: number): void {
    const current = this.get(id);
    this.map.set(id, current + amount);
  }
}
