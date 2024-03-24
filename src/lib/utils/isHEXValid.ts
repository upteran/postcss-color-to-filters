export function isHEXValid(color: string) {
  const HEXColorRegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return !!HEXColorRegExp.test(color);
}
