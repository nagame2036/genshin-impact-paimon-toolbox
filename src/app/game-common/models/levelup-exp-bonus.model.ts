export interface ExpBonus {

  multiplier: number;

  startTime: string;

  endTime: string;
}

export function processExpBonus(
  item: { expBonus?: ExpBonus[] },
  expAmount: number,
  getMora: (mora: number) => number
): { mora: number, exp: number } {
  let exp = expAmount;
  const expBonus = item.expBonus;
  if (expBonus) {
    const now = new Date();
    for (const bonus of expBonus) {
      if (now >= new Date(bonus.startTime) && now <= new Date(bonus.endTime)) {
        exp /= bonus.multiplier;
        break;
      }
    }
  }
  const mora = Math.ceil(getMora(exp));
  exp = Math.ceil(exp);
  return {mora, exp};
}
