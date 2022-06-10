import { Interpreter } from "./interpreter";
import { FileSource } from "./source";
import { Tokenizer } from "./tokenizer";
import path from "path";

const interpreter = new Interpreter();
interpreter.interpret(
  new FileSource(path.join(path.dirname(__dirname), "example1.paper"))
);
