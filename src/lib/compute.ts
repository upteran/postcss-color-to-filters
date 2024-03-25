import { isHEXValid } from './utils/isHEXValid';
import { isRGBValid } from './utils/isRGBValid';
import { hexToRgb } from './utils/hexToRgb';
import { trimRgb } from './utils/trimRgb';
import { ColorController, Solver } from './color-manager';

export function compute(input: string) {
  let rgb: number[];

  if (isHEXValid(input)) {
    rgb = hexToRgb(input);
  } else if (isRGBValid(input)) {
    rgb = trimRgb(input);
  } else {
    return { filterRaw: input };
    // new Error('Invalid format!');
  }

  if (rgb.length !== 3) {
    throw new Error('Invalid format!');
  }

  const color = new ColorController([rgb[0], rgb[1], rgb[2]]);
  const solver = new Solver(color, 12345);
  return solver.solve();
}
