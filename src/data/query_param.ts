import { Proxy } from "../engine/directive";

export class QueryParam {
  constructor(
    public name: string,
    public value: string,
    public description: string = ""
  ) {}
}
