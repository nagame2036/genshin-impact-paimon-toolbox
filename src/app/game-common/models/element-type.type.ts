export const allElements = [
  1, // Anemo, 风
  2, // Geo, 岩
  3, // Electro, 雷
  // 4, // Dendro, 草
  5, // Hydro, 水
  6, // Pyro, 火
  7, // Cryo, 冰
] as const;

export type ElementType = typeof allElements[number];
