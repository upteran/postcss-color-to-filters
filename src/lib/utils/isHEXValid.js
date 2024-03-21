function isHEXValid(color) {
  const HEXColorRegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const isValid = HEXColorRegExp.test(color);

  if (isValid) {
    return true;
  } else {
    return false;
  }
}

module.exports = { isHEXValid };
