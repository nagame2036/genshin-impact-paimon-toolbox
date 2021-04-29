export const allWeaponTypes = [
  1, // Sword, 单手剑
  2, // Claymore, 双手剑
  3, // Polearm, 长柄武器
  4, // Catalyst, 法器
  5, // Bow, 弓
] as const;

export type WeaponType = typeof allWeaponTypes[number];
