/**
 * Represents the five types of weapon.
 */
export enum WeaponType {

  /**
   * In chinese: 单手剑.
   */
  SWORD = 1,

  /**
   * In chinese: 双手剑.
   */
  CLAYMORE,

  /**
   * In chinese: 长柄武器.
   */
  POLEARM,

  /**
   * In chinese: 法器.
   */
  CATALYST,

  /**
   * In chinese: 弓.
   */
  BOW,
}

export const allWeaponTypes = [
  WeaponType.SWORD,
  WeaponType.CLAYMORE,
  WeaponType.POLEARM,
  WeaponType.CATALYST,
  WeaponType.BOW
];
