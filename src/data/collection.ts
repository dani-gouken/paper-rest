import { Context, Proxy } from "../engine/directive";
import { Id } from "./id";
import { Identifiable } from "./object";
import { HttpMethod, Ressource } from "./ressource";

export class Collection implements Identifiable, Proxy {
  protected ressources: Identifiable[] = [];
  constructor(public readonly id: Id) {}

  getId(): Id {
    return this.id;
  }

  get(url: string, id: Id | null = null): Ressource {
    return this.ressource(url, HttpMethod.GET, id);
  }

  post(url: string, id: Id | null = null): Ressource {
    return this.ressource(url, HttpMethod.POST, id);
  }

  put(url: string, id: Id | null = null): Ressource {
    return this.ressource(url, HttpMethod.POST, id);
  }

  ressource(url: string, method: HttpMethod, id: Id | null = null): Ressource {
    let ressource = new Ressource(id ?? Id.prefix("Anonymous"), url, method);
    this.ressources.push(ressource);
    return ressource;
  }
  call(context: Context, method: string, parameters: string[]): Context {
    if (method == "post") {
      return new Context(this.post(parameters[0]));
    }
    throw new Error("bad method call");
  }
  canCall(method: string, parameters: []): boolean {
    throw new Error("Method not implemented.");
  }
}
