export interface OreMaterial {

  groups: OreMaterialGroup[];

  items: OreMaterialItem[];
}

export interface OreMaterialGroup {

  id: number;
}

export interface OreMaterialItem {

  id: number;

  group: number;
}
