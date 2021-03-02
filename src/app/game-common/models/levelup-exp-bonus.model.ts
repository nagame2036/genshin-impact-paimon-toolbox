export interface ExpBonus {
  multiplier: number;

  startTime: string;

  endTime: string;
}

export function processExpBonus(
  item: {expBonus?: ExpBonus[]},
  expAmount: number,
  moraMultiplier: number,
): {moraCost: number; expCost: number} {
  let expCost = expAmount;
  const expBonus = item.expBonus;
  if (expBonus) {
    const now = new Date();
    for (const bonus of expBonus) {
      if (now >= new Date(bonus.startTime) && now <= new Date(bonus.endTime)) {
        expCost /= bonus.multiplier;
        break;
      }
    }
  }
  const moraCost = Math.ceil(expCost * moraMultiplier);
  expCost = Math.ceil(expCost);
  return {moraCost, expCost};
}
