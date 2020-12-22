export interface TempItemCost {

  /**
   * item's id to it's amount.
   */
  [id: number]: number;
}

function concat(items: TempItemCost, that: TempItemCost): void {
  for (const id in that) {
    if (!that.hasOwnProperty(id)) {
      continue;
    }
    if (!items.hasOwnProperty(id)) {
      items[id] = 0;
    }
    items[id] += that[id];
  }
}

export class ItemCostList {

  mora = 0;

  characterExp = 0;

  characterExpItems: TempItemCost = {};

  weaponExp = 0;

  weaponExpItems: TempItemCost = {};

  ores: TempItemCost = {};

  elements: TempItemCost = {};

  gems: TempItemCost = {};

  talents: TempItemCost = {};

  talentBoss: TempItemCost = {};

  talentEvent: TempItemCost = {};

  weapons: TempItemCost = {};

  common: TempItemCost = {};

  localSpecialties: TempItemCost = {};

  addMora(amount: number): ItemCostList {
    this.mora += amount;
    return this;
  }

  addCharacterExp(amount: number): ItemCostList {
    this.characterExp += amount;
    return this;
  }

  addCharacterExpItem(id: number, amount: number): ItemCostList {
    return this.addItem(this.characterExpItems, id, amount);
  }

  addWeaponExp(amount: number): ItemCostList {
    this.weaponExp += amount;
    return this;
  }

  addWeaponExpItem(id: number, amount: number): ItemCostList {
    return this.addItem(this.weaponExpItems, id, amount);
  }

  addOre(id: number, amount: number): ItemCostList {
    return this.addItem(this.ores, id, amount);
  }

  addElemental(id: number, amount: number): ItemCostList {
    return this.addItem(this.elements, id, amount);
  }

  addGem(id: number, amount: number): ItemCostList {
    return this.addItem(this.gems, id, amount);
  }

  addTalent(id: number, amount: number): ItemCostList {
    return this.addItem(this.talents, id, amount);
  }

  addTalentBoss(id: number, amount: number): ItemCostList {
    return this.addItem(this.talentBoss, id, amount);
  }

  addTalentEvent(id: number, amount: number): ItemCostList {
    return this.addItem(this.talentEvent, id, amount);
  }

  addWeapon(id: number, amount: number): ItemCostList {
    return this.addItem(this.weapons, id, amount);
  }

  addCommon(id: number, amount: number): ItemCostList {
    return this.addItem(this.common, id, amount);
  }

  addLocalSpecialty(id: number, amount: number): ItemCostList {
    return this.addItem(this.localSpecialties, id, amount);
  }

  combine(that: ItemCostList): ItemCostList {
    this.addMora(that.mora).addCharacterExp(that.characterExp).addWeaponExp(that.weaponExp);
    concat(this.characterExpItems, that.characterExpItems);
    concat(this.weaponExpItems, that.weaponExpItems);
    concat(this.ores, that.ores);
    concat(this.elements, that.elements);
    concat(this.talents, that.talents);
    concat(this.talentBoss, that.talentBoss);
    concat(this.talentEvent, that.talentEvent);
    concat(this.weapons, that.weapons);
    concat(this.common, that.common);
    concat(this.localSpecialties, that.localSpecialties);
    return this;
  }

  private addItem(items: TempItemCost, id: number, amount: number): ItemCostList {
    items[id] ??= 0;
    items[id] += amount;
    return this;
  }
}
