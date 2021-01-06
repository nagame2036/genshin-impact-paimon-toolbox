export class ItemList {

  /**
   * item's id to it's amount.
   */
  private map = new Map<number, number>();

  getAmount(id: number): number {
    return this.map.get(id) ?? 0;
  }

  setAmount(id: number, amount: number): ItemList {
    this.map.set(id, amount);
    return this;
  }

  change(id: number, amount: number): ItemList {
    this.changeAmount(id, amount);
    return this;
  }

  combine(that: ItemList): ItemList {
    for (const [id, amount] of that.map.entries()) {
      this.changeAmount(id, amount);
    }
    return this;
  }

  private changeAmount(id: number, amount: number): void {
    const current = this.getAmount(id);
    this.setAmount(id, current + amount);
  }

  entries(): [number, number][] {
    const entries: [number, number][] = [];
    for (const item of this.map.entries()) {
      entries.push(item);
    }
    return entries;
  }
}
