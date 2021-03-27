export class MaterialList {
  /**
   * item's id to it's amount.
   */
  private map = new Map<number, number>();

  constructor(list?: MaterialList[]) {
    if (list) {
      this.combineAll(list);
    }
  }

  getAmount(id: number): number {
    return this.map.get(id) ?? 0;
  }

  setAmount(id: number, amount: number): MaterialList {
    this.map.set(id, amount);
    return this;
  }

  change(id: number, amount: number): MaterialList {
    this.changeAmount(id, amount);
    return this;
  }

  combine(that: MaterialList): MaterialList {
    for (const [id, amount] of that.map) {
      this.change(id, amount);
    }
    return this;
  }

  combineAll(list: MaterialList[]): MaterialList {
    for (const materials of list) {
      this.combine(materials);
    }
    return this;
  }

  entries(): [number, number][] {
    return [...this.map];
  }

  private changeAmount(id: number, amount: number): void {
    this.setAmount(id, amount + this.getAmount(id));
  }
}
