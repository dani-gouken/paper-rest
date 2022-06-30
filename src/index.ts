import { Interpreter } from "./interpreter";
import { FileSource, StringSource } from "./source";
import path from "path";

const interpreter = new Interpreter();
interpreter.interpret(
  new FileSource(path.join(path.dirname(__dirname), "example1.paper"))
);

// interpreter.interpret(
//   new StringSource(``)
// );

