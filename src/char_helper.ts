function charUnicodeBetween(
  char: string,
  lower: number,
  upper: number
): boolean {
  if (isEmptyChar(char)) {
    return false;
  }
  const code = char.charCodeAt(0);
  return code > lower && code < upper;
}

export function isEmptyChar(char: string) {
  return char.length == 0;
}
export function isNumericChar(char: string): boolean {
  return charUnicodeBetween(char, 47, 58);
}
export function isAlphabeticChar(char: string): boolean {
  return charUnicodeBetween(char, 64, 91) || charUnicodeBetween(char, 96, 123);
}

export function isAlphaNumeric(char: string) {
  return isAlphabeticChar(char) || isAlphabeticChar(char);
}
