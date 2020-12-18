export function toggleItem(list: { id: number }[], item: { id: number }): any[] {
  const notFound = list.findIndex(it => it.id === item.id) === -1;
  const result = list.filter(it => it.id !== item.id);
  if (notFound) {
    result.push(item);
  }
  return result;
}
