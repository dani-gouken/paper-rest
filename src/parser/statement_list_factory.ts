import { TokenIter } from "../tokenizer/token_iter";
import { ContextTokens, TerminalTokens, Token } from "../types";
import { Statement } from "./statement";
import { StatementIter } from "./statement_iter";

export class StatementListFactory {
    private stopped: boolean = false;
    private statements: Statement[] = [];
    private currentStatement: Statement | null = null;
    constructor(private tokens: TokenIter) {

    }

    build(): StatementIter {
        if (this.tokens.empty()) {
            return new StatementIter([]);
        }
        while (!this.tokens.exhausted() && !this.stopped) {
            const currentToken = this.tokens.current()!;
            if (this.currentStatement == null) {
                this.currentStatement = new Statement([]);
            }
            if (ContextTokens.includes(currentToken.kind)) {
                this.pushCurrentStatement();
                this.currentStatement.add(currentToken);
                this.pushCurrentStatement();
            } else if (TerminalTokens.includes(currentToken.kind)) {
                const previous = this.tokens.prev();
                if (!(previous && TerminalTokens.includes(previous.kind))){
                    this.currentStatement.add(currentToken);
                    this.pushCurrentStatement();
                }
            } else {
                this.currentStatement.add(currentToken);

            }
            this.tokens.peek();

        }
        return new StatementIter(this.statements);
    }

    private pushCurrentStatement() {
        if (this.currentStatement == null) {
            return;
        }
        this.statements.push(this.currentStatement);
        this.currentStatement = new Statement([]);
    }

}