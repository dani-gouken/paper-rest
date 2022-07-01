export enum TokenKind {
    StringLit = "StringLit",
    NumLit = "NumLit",
    Id = "Id",
    Keyword = "Keyword",
    Space = "Space",
    NewLine = "NewLine",
    Equals = "Equals",
    Colon = "Colon",
    Plus = "Plus",
    Minus = "Minus",
    Quote = "Quote",
    Invalid = "Invalid",
    OpCurlyBracket = "OpCurlyBracket",
    CloCurlyBracket = "CloCurlyBracket",
    Error = "Error",
    SemiColon = "SemiColon",
    Comma = "Comma"
}

export const TerminalTokens = [
    TokenKind.NewLine,
    TokenKind.SemiColon,
];

export const ContextStartToken = TokenKind.OpCurlyBracket;
export const ContextEndToken = TokenKind.CloCurlyBracket;
export const ContextTokens = [
    ContextStartToken,
    ContextEndToken
];

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
export const Keyword = typeof Keywords;
export type TokenLoc = {
    line: number;
    start: number;
    end: number;
};

export type Token = {
    location: TokenLoc;
    kind: TokenKind;
    value: string;
};

export type CharLoc = {
    line: number;
    col: number;
};
