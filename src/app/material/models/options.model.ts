import {allRarities, Rarity} from '../../game-common/models/rarity.type';

export interface MaterialViewOptions {
  rarities: Rarity[];

  showOverflow: boolean;

  conciseMode: boolean;
}

export const defaultMaterialViewOptions: MaterialViewOptions = {
  rarities: [...allRarities],
  showOverflow: true,
  conciseMode: false,
};
