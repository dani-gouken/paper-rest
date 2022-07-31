import { StatementIter } from "../../statement_iter";

export interface StatementPassInterface {
    pass(iter: StatementIter): StatementIter
}