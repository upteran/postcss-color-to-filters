export function isRGBValid(color: string) {
  const RGBColorRegExp = /^(rgb\()?\d{1,3}, ?\d{1,3}, ?\d{1,3}(\))?$/i;

  if (!RGBColorRegExp.test(color)) return false;

  color = color.toLowerCase();
  const startCheck = color.startsWith('rgb');
  const endCheck = color.endsWith(')');
  if ((startCheck && !endCheck) || (!startCheck && endCheck)) return false;

  const [r, g, b] = color
    .replace(/^rgb\(|\)| /, '')
    .split(',')
    .map((x) => parseInt(x));
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}
