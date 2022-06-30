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
export function isString(char: any) {
  return char && typeof char == "string";
}
export function isNumericChar(char: string): boolean {
  return charUnicodeBetween(char, 47, 58);
}
export function isAlphabeticChar(char: string): boolean {
  return charUnicodeBetween(char, 64, 91) || charUnicodeBetween(char, 96, 123);
}

export function isAlphaNumericChar(char: string): boolean {
  return isAlphabeticChar(char) || isAlphabeticChar(char);
}

export function isSpaceChar(char: string){
  return ' \t\r\v'.indexOf(char) > -1;
}

export function isNotSpaceChar(char: string){
  return !isSpaceChar(char);
}

export function isQuote(char: string): boolean{
  return (char == "'") || (char == '"');
}

export function isNotQuote(char: string): boolean{
  return !isQuote(char);
}