import { CodeInterface, SourceInterface } from "./source";
import { Token } from "./types";
export class ParseError {
    constructor(
        private opts: {
            message: string
        }

    ) { }
}
export class LexicalError {
    constructor(
        private opts: {
            message: string;
            token: Token;
            code: CodeInterface
        }
    ) {

    }

    getMessage(): string {
        return this.opts.message;
    }

    getToken(): Token {
        return this.opts.token;
    }

    getCode(): CodeInterface {
        return this.opts.code;
    }
}

export interface ErrorWriterInterface {
    writeLexicalError(error: LexicalError): void;
}

export class ConsoleErrorWriter implements ErrorWriterInterface {
    writeLexicalError(error: LexicalError): void {
        console.log(
            `Lexical error: ${error.getMessage()} at ${error.getToken().location.line}:${error.getToken().location.start}`
        );
        const loc = error.getToken().location;
        const line: string = error.getCode().getLines()[error.getToken().location.line - 1];
        let message = "";
        let indicators = ""
        for (let i = 0; i < line.length; i++) {
            message += line.charAt(i);
            indicators += (i < loc.start) ? " " : "^";
        }
        console.log(message);
        console.log(indicators);

    }

}