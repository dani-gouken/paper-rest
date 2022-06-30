import { CodeInterface } from "../source";
import { CharIter } from "./char_iter";
import { isAlphaNumericChar, isEmptyChar, isNotQuote, isNotSpaceChar, isNumericChar, isQuote, isSpaceChar, isString } from "./char_helper";
import { ConsoleErrorWriter, LexicalError } from "../error";
import { CharLoc, Keyword, Token, TokenKind, TokenLoc } from "../types";

export interface TokenizerInterface {
  getTokens(): { error: boolean, tokens: Token[] };
}

export class Tokenizer implements TokenizerInterface {
  private currentToken: Token | null = null;
  private nextToken: Token | null = null;
  private line: number = 0;
  private col: number = 0;
  private error?: LexicalError;

  private tokens: Token[] = [];

  private shouldStop: boolean = false;

  private iter: CharIter;

  constructor(private code: CodeInterface) {
    this.iter = new CharIter(code.getContent());
    this.iter.onMoveNext(() => this.col++);
  }

  addError(message: string, token: Token): Token {
    this.error = new LexicalError({
      message,
      code: this.code,
      token
    });
    return token;
  }

  hasError(): boolean {
    return this.error != null;
  }

  getTokens(): { error: boolean, tokens: Token[] } {
    if (!this.iter.empty()) {
      this.tokenize();
    }
    return { error: this.hasError(), tokens: this.tokens ?? [] };
  }

  tokenize() {
    this.line = 1;
    this.col = 0;
    do {
      const token = this.ingest();
      if (this.hasError()) {
        (new ConsoleErrorWriter()).writeLexicalError(this.error!)
        break;
      }
      this.tokens.push(token);
    } while (this.iter.nextIf(isString) || this.stopped())
  }

  stop() {
    this.shouldStop = true;
  }

  stopped() {
    this.shouldStop == true;
  }

  currentLoc(): CharLoc {
    return {
      line: this.line,
      col: this.col,
    };
  }

  tokenLocFromCharLoc(start: CharLoc, end?: CharLoc | null): TokenLoc {
    return {
      line: start.line,
      start: start.col,
      end: end?.col ?? start?.col,
    };
  }

  tokenFromCurrentChar(kind: TokenKind): Token {
    return {
      kind: kind,
      value: this.iter.current()!,
      location: this.tokenLocFromCharLoc(this.currentLoc()),
    };
  }

  ingestNewLine(): Token {
    const token = this.tokenFromCurrentChar(TokenKind.NewLine);
    this.col = -1;
    this.line++;
    return token;
  }

  ingestSpace(): Token {
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

  ingestString(): Token {
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
  ingestId(): Token {
    const start = this.currentLoc();
    let charBegin = this.iter.current();
    let word = this.iter.current()!;
    let charEnd;
    while (this.iter.nextIf((v) => isAlphaNumericChar(v) || v == "_")) {
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

  ingestNumber(): Token {
    const start = this.currentLoc();
    let charBegin = this.iter.current();
    let word = this.iter.current()!;
    let charEnd;
    let hasDecimalPoint = false;
    while (this.iter.nextIf((v) => isNumericChar(v) || (v == "."  && !hasDecimalPoint))) {
      charEnd = this.iter.current();
      hasDecimalPoint = charEnd === ".";
      word += charEnd;
    }
    const isKeyword = Keyword.includes(word);
    return {
      kind: isKeyword ? TokenKind.Keyword : TokenKind.Id,
      location: this.tokenLocFromCharLoc(start, this.currentLoc()),
      value: word
    };
  }

  ingest(): Token {
    switch (true) {
      case this.iter.is("\n"):
        return this.ingestNewLine();
      case this.iter.is("="):
        return this.tokenFromCurrentChar(TokenKind.Equals);
      case this.iter.is(";"):
        return this.tokenFromCurrentChar(TokenKind.SemiColon);
      case this.iter.is(":"):
        return this.tokenFromCurrentChar(TokenKind.Equals);
      case this.iter.is(","):
        return this.tokenFromCurrentChar(TokenKind.Equals);
      case this.iter.is("+"):
        return this.tokenFromCurrentChar(TokenKind.Plus);
      case this.iter.is("-"):
        return this.tokenFromCurrentChar(TokenKind.Minus);
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
          return this.ingestId();
        } else if (this.iter.isNumeric()) {
         return this.ingestNumber();
        } else {
          return this.addError(`unexpected ${this.iter.current()}`, this.tokenFromCurrentChar(TokenKind.Error));
        }
    }
  }
}
