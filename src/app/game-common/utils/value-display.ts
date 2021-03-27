function fround(value: number): string {
  const text = Math.fround(value).toFixed(1);
  return text.replace(/.0+$/g, '');
}

/**
 * Return the string represent of value
 * @param value value
 */
export function v(value: number): string {
  return fround(value);
}

/**
 * Return the percent represent of value.
 * @param value value
 */
export function p(value: number): string {
  return `${fround(value * 100)}%`;
}
