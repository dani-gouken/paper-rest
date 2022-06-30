import { SourceInterface } from "./source";
import { Tokenizer, TokenizerInterface } from "./tokenizer/tokenizer";

export class Interpreter {
  async interpret(source: SourceInterface) {
    const code = await source.getCode();
    const tokenizer = new Tokenizer(code);
    const { error, tokens } = tokenizer.getTokens();
    if(!error){
      console.log(tokens);
    }
  }
}
