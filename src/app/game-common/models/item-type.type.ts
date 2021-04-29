export const itemTypeNames = ['character', 'weapon', 'artifact'] as const;

export type ItemType = typeof itemTypeNames[number];
