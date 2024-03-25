import { hexToCSSFilter } from 'hex-to-css-filter';
import { isHEXValid } from './utils/isHEXValid';
import { isRGBValid } from './utils/isRGBValid';
import { rgbToHex } from './utils/rgbToHex';


const config = {
  maxChecks: 5,
};
export function compute(input: string, acceptanceLossPercentage?: number) {
  if (isHEXValid(input)) {
    return hexToCSSFilter(input, config);
  } else if (isRGBValid(input)) {
    return hexToCSSFilter(rgbToHex(input), {...config, acceptanceLossPercentage: acceptanceLossPercentage || 1});
  } else {
    return { filter: input };
  }
}
