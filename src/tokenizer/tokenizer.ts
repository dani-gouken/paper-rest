import { Code, CodeInterface, StringSource } from "../source";
import { CharIter } from "./char_iter";
import { isAlphaNumericChar, isNumericChar, isSpaceChar, isString } from "./char_helper";
import { LexicalError } from "../error";
import { CharLoc, Keyword, Token, TokenKind, TokenLoc } from "../types";
import { TokenIter } from "./token_iter";

export interface TokenizerInterface {
  getTokens(): TokenIter
};

export class Tokenizer implements TokenizerInterface {
  private currentToken: Token | null = null;
  private nextToken: Token | null = null;
  private line: number = 0;
  private col: number = 0;
  private error?: LexicalError;

  private tokens: Token[] = [];

  private shouldStop: boolean = false;

  private iter: CharIter;
  static fromString(code: string): Tokenizer {
    return new Tokenizer(new Code(code));
  }

  constructor(private code: CodeInterface) {
    this.iter = new CharIter([...code.getContent()]);
    this.iter.onMoveNext(() => this.col++);
  }

  protected addError(message: string, token: Token): Token {
    this.error = new LexicalError({
      message,
      code: this.code,
      token
    });
    return token;
  }

  protected hasError(): boolean {
    return this.error != null;
  }

  getTokens(): TokenIter {
    if (!this.iter.empty()) {
      this.tokenize();
    }
    return new TokenIter(this.tokens ?? []);
  }

  protected tokenize() {
    this.line = 1;
    this.col = 0;
    do {
      const token = this.ingest();
      if (this.hasError()) {
        throw this.error;
      }
      this.tokens.push(token);
    } while (this.iter.nextIf(isString) || this.stopped())
  }

  protected stop() {
    this.shouldStop = true;
  }

  protected stopped() {
    this.shouldStop == true;
  }

  protected currentLoc(): CharLoc {
    return {
      line: this.line,
      col: this.col,
    };
  }

  protected tokenLocFromCharLoc(start: CharLoc, end?: CharLoc | null): TokenLoc {
    return {
      line: start.line,
      start: start.col,
      end: end?.col ?? start?.col,
    };
  }

  protected tokenFromCurrentChar(kind: TokenKind): Token {
    return {
      kind: kind,
      value: this.iter.current()!,
      location: this.tokenLocFromCharLoc(this.currentLoc()),
    };
  }

  protected ingestNewLine(): Token {
    const token = this.tokenFromCurrentChar(TokenKind.NewLine);
    this.col = -1;
    this.line++;
    return token;
  }

  protected ingestSpace(): Token {
    const start = this.currentLoc();
    let word = this.iter.current()!;
    while (this.iter.nextIf(isSpaceChar)) {
      word += this.iter.current()!;
    }
    let end = this.currentLoc();
    return {
      kind: TokenKind.Space,
      location: this.tokenLocFromCharLoc(start, end),
      value: word
    };
  }

  protected ingestString(): Token {
    const start = this.currentLoc();
    let charBegin = this.iter.current();
    let word = this.iter.current()!;
    let charEnd;
    while (this.iter.peek()) {
      let escaped = false;
      charEnd = this.iter.current();
      if ((charEnd == "\n")) {
        break;
      }
      if (charEnd == '\\' && this.iter.nextIf((v) => !isSpaceChar(v))) {
        charEnd = this.iter.current();
        escaped = true;
      }
      word += charEnd;
      if (!escaped && (charEnd == charBegin)) {
        break;
      }
    }
    let end = this.currentLoc();
    if (charBegin != charEnd) {
      this.addError("Non terminated string", {
        kind: TokenKind.Error,
        location: this.tokenLocFromCharLoc(start, this.currentLoc()),
        value: word
      })
    }
    return {
      kind: TokenKind.StringLit,
      location: this.tokenLocFromCharLoc(start, end),
      value: word
    };
  }
  protected ingestIdOrString(): Token {
    const start = this.currentLoc();
    let charBegin = this.iter.current();
    let word = this.iter.current()!;
    let charEnd;
    while (this.iter.nextIf((v) => isAlphaNumericChar(v) || ["_", "-"].includes(v))) {
      charEnd = this.iter.current();
      word += charEnd;
    }
    const isKeyword = Keyword.includes(word);
    return {
      kind: isKeyword ? TokenKind.Keyword : TokenKind.Id,
      location: this.tokenLocFromCharLoc(start, this.currentLoc()),
      value: word
    };
  }

  protected ingestNumber(): Token {
    const start = this.currentLoc();
    let word = this.iter.current()!;
    let charEnd;
    let hasDecimalPoint = false;
    while (this.iter.nextIf((v) => isNumericChar(v) || (v == "." && !hasDecimalPoint))) {
      charEnd = this.iter.current();
      if (!hasDecimalPoint && charEnd === ".") {
        hasDecimalPoint = true;
      }
      word += charEnd;
    }
    return {
      kind: TokenKind.NumLit,
      location: this.tokenLocFromCharLoc(start, this.currentLoc()),
      value: word
    };
  }

  protected ingest(): Token {
    switch (true) {
      case this.iter.is("\n"):
        return this.ingestNewLine();
      case this.iter.is("="):
        return this.tokenFromCurrentChar(TokenKind.Equals);
      case this.iter.is(";"):
        return this.tokenFromCurrentChar(TokenKind.SemiColon);
      case this.iter.is("+"):
        return this.tokenFromCurrentChar(TokenKind.Plus);
      case this.iter.is("-"):
        return this.tokenFromCurrentChar(TokenKind.Minus);
      case this.iter.is(":"):
        return this.tokenFromCurrentChar(TokenKind.Colon);
      case this.iter.is(","):
        return this.tokenFromCurrentChar(TokenKind.Comma);
      case this.iter.is("{"):
        return this.tokenFromCurrentChar(TokenKind.OpCurlyBracket);
      case this.iter.is("}"):
        return this.tokenFromCurrentChar(TokenKind.CloCurlyBracket);
      case this.iter.isSpace():
        return this.ingestSpace();
      case this.iter.is("'") || this.iter.is('"'):
        return this.ingestString();
      default:
        if (this.iter.isAlpha() || this.iter.is("_")) {
          return this.ingestIdOrString();
        } else if (this.iter.isNumeric()) {
          return this.ingestNumber();
        } else {
          return this.addError(`unexpected ${this.iter.current()}`, this.tokenFromCurrentChar(TokenKind.Error));
        }
    }
  }
}
