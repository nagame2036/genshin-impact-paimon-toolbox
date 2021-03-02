import {Rarity} from '../../game-common/models/rarity.type';
import {MaterialType} from './material-type.enum';

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

  constructor(
    type: MaterialType,
    info: MaterialInfo,
    have: number,
    need: number,
  ) {
    this.type = type;
    this.info = info;
    this.update(have, need);
  }

  update(have: number, need: number): void {
    this.have = have;
    this.need = need;
    this.lack = Math.max(0, this.need - this.have);
    this.overflow = this.lack <= 0;
  }

  copy(): MaterialDetail {
    return new MaterialDetail(this.type, this.info, this.have, this.need);
  }
}

export interface CraftRecipe {
  /**
   * Item id to amount.
   */
  [id: number]: number;
}
