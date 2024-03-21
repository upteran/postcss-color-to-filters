function trimRgb(rgb) {
  const [r, g, b] = rgb
    .replace(/rgb\(|\) /i, '')
    .split(',')
    .map((x) => parseInt(x));
  return [r, g, b];
}

module.exports = { trimRgb };
