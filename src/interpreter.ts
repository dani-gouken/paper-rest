import { ConsoleErrorWriter, LexicalError } from "./error";
import { StatementListFactory } from "./parser/statement_list_factory";
import { SourceInterface } from "./source";
import { Tokenizer, TokenizerInterface } from "./tokenizer/tokenizer";

export class Interpreter {
  async interpret(source: SourceInterface) {
    const code = await source.getCode();
    const tokenizer = new Tokenizer(code);
    try {
      const tokens = tokenizer.getTokens();
      const statementFactory = new StatementListFactory(tokens);
      console.log(JSON.stringify(statementFactory.build(),null,4));
      
    }catch(err){
      const errorWriter = new ConsoleErrorWriter();
      if(err instanceof LexicalError){
        errorWriter.writeLexicalError(err);
      }
     throw err;

    }
  }
}
