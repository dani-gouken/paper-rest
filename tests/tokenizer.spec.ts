import { LexicalError } from "../src/error";
import { Tokenizer } from "../src/tokenizer/tokenizer";
import { Token, TokenKind } from "../src/types";

describe("tokenizer", function () {
    test("it tokenize identifiers", () => {
        let tokenizer = Tokenizer.fromString('POST GET');
        const tokens = tokenizer.getTokens();
        expect(tokens.all()).toHaveLength(3);
        expect(tokens.all()).toEqual([
            {
                kind: TokenKind.Id,
                location: {
                    line: 1,
                    start: 0,
                    end: 3
                },
                value: "POST"
            },
            {
                kind: TokenKind.Space,
                location: {
                    line: 1,
                    start: 4,
                    end: 4
                },
                value: " "
            },

            {
                kind: TokenKind.Id,
                location: {
                    start: 5,
                    end: 7,
                    line: 1,
                },
                value: "GET"
            }
        ] as Token[]);

    });
    describe("string litteral tokenization", () => {
        test("it tokenize string lit literals", () => {
            let tokenizer = Tokenizer.fromString('POST "https://google.fr"');
            const tokens = tokenizer.getTokens();
            expect(tokens.all()).toHaveLength(3);
            expect(tokens.all()).toEqual([
                {
                    kind: TokenKind.Id,
                    location: {
                        line: 1,
                        start: 0,
                        end: 3
                    },
                    value: "POST"
                },
                {
                    kind: TokenKind.Space,
                    location: {
                        line: 1,
                        start: 4,
                        end: 4
                    },
                    value: " "
                },

                {
                    kind: TokenKind.StringLit,
                    location: {
                        start: 5,
                        end: 23,
                        line: 1,
                    },
                    value: '"https://google.fr"'
                }
            ] as Token[]);

        });
        test("quote characters are escaped", () => {
            let tokenizer = Tokenizer.fromString('"test\\"quote\\""');
            const tokens = tokenizer.getTokens();
            expect(tokens.all()).toHaveLength(1);
            expect(tokens.all()).toEqual([
                {
                    kind: TokenKind.StringLit,
                    location: {
                        start: 0,
                        end: 14,
                        line: 1
                    },
                    value: '"test"quote""'
                }
            ] as Token[]);
        });
        test("it raise an error when a string is not terminated", () => {
            expect(() => {
                let tokenizer = Tokenizer.fromString('POST "https://google');
                tokenizer.getTokens();
            }).toThrow(LexicalError) 
        });
    });
    describe("number tokenization", () => {
        test("it tokenize numbers", () => {
            let tokenizer = Tokenizer.fromString('1234');
            const tokens = tokenizer.getTokens();
            expect(tokens.all()).toHaveLength(1);
            expect(tokens.all()).toEqual([
                {
                    kind: TokenKind.NumLit,
                    location: {
                        line: 1,
                        start: 0,
                        end: 3
                    },
                    value: "1234"
                }
            ] as Token[]);
        });
        test("it numbers with decimal", () => {
            let tokenizer = Tokenizer.fromString('1234.7');
            const tokens = tokenizer.getTokens();
            expect(tokens.all()).toHaveLength(1);
            expect(tokens.all()).toEqual([
                {
                    kind: TokenKind.NumLit,
                    location: {
                        line: 1,
                        start: 0,
                        end: 5
                    },
                    value: "1234.7"
                }
            ] as Token[]);
        });
    });
    
    
});