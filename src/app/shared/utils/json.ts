export function load(data: any): any {
  const text = JSON.stringify(data, (k, v) =>
    typeof v === 'number' ? Math.fround(v) : v,
  );
  return JSON.parse(text);
}

export function objectMap<T extends {id: number}>(obj: {
  [id: number]: T;
}): Map<number, T> {
  const result = new Map<number, T>();
  for (const [key, value] of Object.entries(obj)) {
    const newKey = Number(key);
    value.id = newKey;
    result.set(newKey, value);
  }
  return result;
}
