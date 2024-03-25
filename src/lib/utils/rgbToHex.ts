export function rgbToHex(rgb: string): string {
  const componentToHex = (c: number) => c.toString(16).padStart(2, '0');

  const values = rgb.match(/\d+/g);
  if (!values) {
    throw new Error('Invalid format!');
  }

  const [r, g, b] = values.map(Number);
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}
