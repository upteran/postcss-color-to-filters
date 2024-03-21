function expandHex(hextexp) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hextexp = hextexp.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });
  return hextexp;
}

function hexToRgb(hex) {
  const expandedHex = expandHex(hex);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}

module.exports = { hexToRgb };
