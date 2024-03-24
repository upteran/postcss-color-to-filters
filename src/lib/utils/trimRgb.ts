export function trimRgb(rgb: string) {
  const [r, g, b] = rgb
    .replace(/rgb\(|\) /i, '')
    .split(',')
    .map((x) => parseInt(x));
  return [r, g, b];
}
