import { PeekableIter } from "../peekable_iter";
import { isAlphabeticChar, isAlphaNumericChar, isNumericChar, isSpaceChar } from "./char_helper";

export class CharIter extends PeekableIter<string> {
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
