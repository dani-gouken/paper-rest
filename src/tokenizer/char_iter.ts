import { isAlphabeticChar, isAlphaNumericChar, isNumericChar, isSpaceChar } from "./char_helper";

export class CharIter {
  private chars: string[];
  private position: number = 0;
  private nextCb?: {(char: string): void}

  constructor(string: string) {
    this.chars = [...string];
  }

  onMoveNext(fn : {(char: string): void}){
    this.nextCb = fn;
  }

  peek(): string | null {
    const peeked = this.chars[this.position++];
    if(peeked){
      this.nextCb?.call(this,peeked);
    }
    return peeked;
  }

  nextIf(predicate: { (value: string): boolean }): boolean {
    const next = this.next();
    if(!next){
      return false;
    } 
    if (predicate(next)) {
      this.peek();
      return true;
    }
    return false;
  }

  empty(): boolean {
    return this.chars.length == 0;
  }

  current(): string | null {
    return this.chars[this.position];
  }

  get(position: number): string | null {
    return this.chars[position] ?? null;
  }

  next(): string | null {
    return this.get(this.position + 1);
  }

  prev(): string | null {
    return this.get(this.position - 1);
  }

  is(expected: string): boolean {
    return this.current() === expected;
  }

  isAlpha(): boolean {
    return !this.current() ? false : isAlphabeticChar(this.current()!);
  }

  isAlphaNumeric(): boolean {
    return !this.current() ? false : isAlphaNumericChar(this.current()!);
  }

  isNumeric(): boolean {
    return !this.current() ? false : isNumericChar(this.current()!);
  }

  isIdChar(): boolean {
    return this.isAlphaNumeric() || this.is("-") || this.is("_");
  }

  isSpace(): boolean {
    return !this.current() ? false : isSpaceChar(this.current()!);;
  }

}
