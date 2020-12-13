export interface OreItemsData {

  groups: OreGroup[];

  items: OreItem[];
}

export interface OreGroup {

  id: number;
}

export interface OreItem {

  id: number;

  group: number;
}
