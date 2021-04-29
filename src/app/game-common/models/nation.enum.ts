export const nations = [
  1, // 蒙德
  2, // 璃月
  3, // 稻妻
  4, // 须弥
  5, // 枫丹
  6, // 穆纳塔
  7, // 至冬
] as const;

export type Nation = typeof nations[number];
