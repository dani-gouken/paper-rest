import { Context, Proxy } from "../engine/directive";
import { Header } from "./header";
import { Id } from "./id";
import { Identifiable } from "./object";
import { QueryParam } from "./query_param";

export enum HttpMethod {
  POST,
  GET,
  PUT,
  PATCH,
  DELETE,
  OPTIONS,
  TRACE,
}

export class Ressource implements Identifiable, Proxy {
  protected headers: Header[] = [];
  protected queryParams: QueryParam[] = [];

  constructor(
    public readonly id: Id,
    protected url: string,
    protected method: HttpMethod = HttpMethod.GET
  ) {}

  call(context: Context, method: string, parameters: string[]): Context|null {
    if (method == "header") {
      this.header(parameters[0], parameters[1]);
      return null;
    }
    throw new Error("bad directive call");
  }
  canCall(method: string, parameters: []): boolean {
    throw new Error("Method not implemented.");
  }

  getId(): Id {
    return this.id;
  }

  public header(key: string, value: string): Header {
    let header = new Header(key, value);
    this.headers.push(header);
    return header;
  }

  public query(key: string, value: string): Header {
    let queryParam = new QueryParam(key, value);
    this.queryParams.push(queryParam);
    return queryParam;
  }
}
