import { isHEXValid } from './utils/isHEXValid';
import { isRGBValid } from './utils/isRGBValid';
import { hexToRgb } from './utils/hexToRgb';
import { trimRgb } from './utils/trimRgb';
import { ColorController, Solver } from './ColorController';

export function compute(input: string) {
  let rgb: number[];

  switch (true) {
    case isHEXValid(input):
      rgb = hexToRgb(input);
      break;
    case isRGBValid(input):
      rgb = trimRgb(input);
      break;
    default:
      throw new Error('Invalid format!');
  }

  if (rgb.length !== 3) {
    throw new Error('Invalid format!');
  }

  const color = new ColorController([rgb[0], rgb[1], rgb[2]]);
  const solver = new Solver(color);
  return solver.solve();
}
