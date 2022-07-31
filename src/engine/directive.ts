import { Collection } from "../data/collection";
import { Id } from "../data/id";

export interface Proxy {
  call(context: Context, method: string, parameters: string[]): Context | null;

  canCall(method: string, parameters: []): boolean;
}

export class Context {
  constructor(
    public readonly focus: Proxy,
    public readonly data = [],
    public readonly focusable: boolean = false,
    public parent: Context | null = null
  ) {}

  public setParent(p: Context): void {
    this.parent = p;
  }
}

export class Engine {
  protected context: Context = new Context(new Collection(new Id("Global")));
  protected lastContext: Context | null = null;

  public call(method: string, parameters: string[]) {
    let result = this.context.focus.call(this.context, method, parameters);
    this.lastContext = result;
    if (this.lastContext != null) {
      this.lastContext.setParent(this.context);
    }
  }
  public getContext(): Context {
    return this.context;
  }
  public shape() {
    if (this.lastContext == null) {
      throw new Error("cannot focus");
    }
    this.context = this.lastContext;
    this.lastContext = null;
  }

  public end() {
    if (this.context.parent == null) {
      throw new Error("duh");
    }
    this.context = this.context.parent;
    this.lastContext = null;
  }
}
