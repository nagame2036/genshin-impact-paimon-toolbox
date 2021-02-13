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

  has(id: number): boolean {
    return this.map.has(id);
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

  combineAll(list: MaterialList[]): MaterialList {
    for (const materials of list) {
      for (const [id, amount] of materials.map) {
        this.change(id, amount);
      }
    }
    return this;
  }

  private changeAmount(id: number, amount: number): void {
    if (amount !== 0) {
      this.setAmount(id, amount + this.getAmount(id));
    }
  }

  entries(): [number, number][] {
    return [...this.map];
  }
}
