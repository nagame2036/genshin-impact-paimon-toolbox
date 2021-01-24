interface IPlan {
  id: number;
}

export function activePlans<Plan extends IPlan, Party>(plans: Plan[], partyList: Map<number, Party>): { plan: Plan, party: Party }[] {
  const active = [];
  for (const plan of plans) {
    const party = partyList.get(plan.id);
    if (party) {
      active.push({party, plan});
    }
  }
  return active;
}
