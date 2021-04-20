export class MaterialList {
  private idAmount = new Map<number, number>();

  constructor(list: MaterialList[] = []) {
    this.combineAll(list);
  }

  getAmount(id: number): number {
    return this.idAmount.get(id) ?? 0;
  }

  setAmount(id: number, amount: number): MaterialList {
    this.idAmount.set(id, amount);
    return this;
  }

  change(id: number, amount: number): MaterialList {
    this.changeAmount(id, amount);
    return this;
  }

  combine(that: MaterialList): MaterialList {
    that.idAmount.forEach((amount, id) => this.change(id, amount));
    return this;
  }

  combineAll(list: MaterialList[]): MaterialList {
    list.forEach(it => this.combine(it));
    return this;
  }

  entries(): [number, number][] {
    return [...this.idAmount];
  }

  private changeAmount(id: number, amount: number): void {
    this.setAmount(id, amount + this.getAmount(id));
  }
}
