export class Id {
  private static counter = 0;
  readonly id: number;
  constructor(public readonly name: string) {
    this.id = Id.counter++;
  }
  
  public static prefix(prefix: string): Id {
    return new Id(this.genericName(prefix));
  }

  protected static genericName(prefix: string): string {
    return `${prefix}#${Id.counter}`;
  }
}
