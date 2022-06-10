import { SourceInterface } from "./source";
import { Tokenizer, TokenizerInterface } from "./tokenizer";

export class Interpreter {
  async interpret(source: SourceInterface) {
    const code = await source.getCode();
    const tokenizer = new Tokenizer(code);
    const tokens = tokenizer.getTokens();
  }
}
