const { isHEXValid } = require('./utils/isHEXValid');
const { isRGBValid } = require('./utils/isRGBValid');
const { hexToRgb } = require('./utils/hexToRgb');
const { trimRgb } = require('./utils/trimRgb');
const { ColorController, Solver } = require('./ColorController');

export function compute(input: string) {
  let rgb;

  if (isHEXValid(input)) {
    rgb = hexToRgb(input);
  } else if (isRGBValid(input)) {
    rgb = trimRgb(input);
  } else {
    alert('Invalid format!');
    return;
  }

  if (rgb.length !== 3) {
    alert('Invalid format!');
    return;
  }

  const color = new ColorController(rgb[0], rgb[1], rgb[2]);
  const solver = new Solver(color);
  const result = solver.solve();

  return result;
}
