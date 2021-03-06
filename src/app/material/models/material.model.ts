import {Rarity} from '../../game-common/models/rarity.type';
import {MaterialType} from './material-type.enum';
import {CraftRecipe} from './craft.type';

export interface MaterialInfo {
  id: number;

  group?: number;

  rarity: Rarity;

  /**
   * Material source id.
   */
  source?: number[];

  recipes?: CraftRecipe[];
}

export class MaterialDetail {
  info: MaterialInfo;

  type: MaterialType;

  need = 0;

  have = 0;

  craftable = false;

  lack = 0;

  overflow = true;

  readonly = false;

  constructor(type: MaterialType, info: MaterialInfo, have: number = 0, need: number = 0) {
    this.type = type;
    this.info = info;
    this.update(have, need);
  }

  updateHave(value: number): void {
    this.update(value, this.need);
  }

  updateNeed(value: number): void {
    this.update(this.have, value);
  }

  copy(have: number, need: number): MaterialDetail {
    const copy = new MaterialDetail(this.type, this.info, have, need);
    copy.lack = this.overflow ? 0 : Math.max(0, need - have);
    copy.overflow = copy.lack <= 0;
    copy.craftable = this.craftable;
    return copy;
  }

  private update(have: number, need: number): void {
    this.have = have;
    this.need = need;
    this.lack = Math.max(0, this.need - this.have);
    this.overflow = this.lack <= 0;
  }
}
