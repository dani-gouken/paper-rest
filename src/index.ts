import { Interpreter } from "./interpreter";
import { FileSource, StringSource } from "./source";
import path from "path";
import { Engine } from "./engine/directive";

// const interpreter = new Interpreter();
//interpreter.interpret(
//  new FileSource(path.join(path.dirname(__dirname), "example1.paper"))
//);

const engine = new Engine();

engine.call("post", ["http://google.fr"])

engine.shape();
engine.call("header", ["foo","bar"])
engine.end();
console.log(engine.getContext())

// interpreter.interpret(
//   new StringSource(``)
// );

