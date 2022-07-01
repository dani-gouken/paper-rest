import { ParseError } from "../error";
import { Token } from "../types";

export class Statement {
    constructor(private tokens: Token[]) {
    }

    add(token: Token){
        this.tokens.push(token);
    }

    getTokens() {
        return this.tokens;
    }

    getTerminalToken(): Token {
        return this.tokens[this.tokens.length - 1];
    }
}