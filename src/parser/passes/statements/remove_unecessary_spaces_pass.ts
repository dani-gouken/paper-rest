import { Token, TokenKind } from "../../../types";
import { Statement } from "../../statement";
import { StatementIter } from "../../statement_iter";
import { StatementPassInterface } from "./statement_pass_interface";

class RemoveUnecessarySpacesPass implements StatementPassInterface {
    pass(iter: StatementIter): StatementIter {
        const data = iter.all();
        const statements: Statement[] = [];
        for (let statement of data) {
            const tokens = [];
            if (statement.length() == 0) {
                continue;
            }
            if (statement.length() == 1 && this.isIgnorableToken(statement.getTokens()[0])) {
                continue;
            }
        };
        return new StatementIter(statements);
    }

    isIgnorableToken(token: Token) {
        return token.kind == TokenKind.Space || (token.kind == TokenKind.NewLine);
    }

}