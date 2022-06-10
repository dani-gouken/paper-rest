import { Code } from "./source";

export type TokenKind =
  | "StringLit"
  | "NumLit"
  | "Id"
  | "Keyword"
  | "Space"
  | "NewLine"
  | "Colon"
  | "Equals"
  | "Plus"
  | "Minus"
  | "Quote"
  | "Invalid";

export const Keywords = [
  "string",
  "auth",
  "req",
  "endreq",
  "post",
  "header",
  "query",
  "json",
];
const Keyword = typeof Keywords;
type TokenLoc = {
  line: number;
  start: number;
  end: number;
};

export type Token = {
  location: TokenLoc;
  kind: TokenKind;
  value: string;
};
type CharLoc = {
  line: number;
  col: number;
};

export interface TokenizerInterface {
  getTokens(): Token[];
}

export class Tokenizer implements TokenizerInterface {
  private currentToken: Token | null = null;
  private nextToken: Token | null = null;
  private line: number = 0;
  private col: number = 0;

  private tokens: Token[] | null = null;

  private iter: CharIter;

  constructor(private code: Code) {
    this.iter = new CharIter(code.content);
  }

  getTokens(): Token[] {
    if (!this.tokens && !this.iter.empty()) {
      this.tokenize();
    }
    return this.tokens ?? [];
  }

  tokenize() {
    this.line = 1;
    this.col = 1;
    while (this.iter.peek()) {
      this.ingest();
    }
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
      value: this.iter.current(),
      location: this.tokenLocFromCharLoc(this.currentLoc()),
    };
  }
  ingestNewLine(): Token {
    this.col = 1;
    this.line++;
    return this.tokenFromCurrentChar("NewLine");
  }
  ingest(): Token {
    switch (true) {
      case this.iter.is("\n"):
        return this.ingestNewLine();
      case this.iter.is(":"):
        return this.tokenFromCurrentChar("Colon");
      case this.iter.is("="):
        return this.tokenFromCurrentChar("Equals");
      case this.iter.is("+"):
        return this.tokenFromCurrentChar("Plus");
      default:
        break;
    }
  }
}
