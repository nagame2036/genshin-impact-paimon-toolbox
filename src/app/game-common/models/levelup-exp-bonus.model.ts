export interface ExpBonus {

  factor: number;

  startTime: string;

  endTime: string;
}

export function processExpBonus(
  item: { expBonus?: ExpBonus[] },
  moraAmount: number,
  getExp: (mora: number) => number
): { mora: number, exp: number } {
  let mora = moraAmount;
  const expBonus = item.expBonus;
  if (expBonus) {
    const now = new Date();
    for (const bonus of expBonus) {
      if (now >= new Date(bonus.startTime) && now <= new Date(bonus.endTime)) {
        mora /= bonus.factor;
        break;
      }
    }
  }
  const exp = Math.ceil(getExp(mora));
  mora = Math.ceil(mora);
  return {mora, exp};
}
