export interface OreItemsData {

  groups: { [id: number]: OreGroup };

  items: { [id: number]: OreItem };
}

// tslint:disable-next-line:no-empty-interface
export interface OreGroup {
}

export interface OreItem {

  group: number;
}
