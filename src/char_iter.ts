class CharIter {
  private chars: string[];
  private position: number = 0;

  constructor(string: string) {
    this.chars = [...string];
  }

  peek(): string | null {
    return this.chars[this.position++];
  }

  empty(): boolean {
    return this.chars.length == 0;
  }

  current(): string | null {
    return this.chars[this.position];
  }

  get(position: number): string | null {
    return this.chars[position] ?? null;
  }

  next(): string | null {
    return this.get(this.position + 1);
  }

  prev(): string | null {
    return this.get(this.position - 1);
  }

  is(expected: string) {
    return this.current() === expected;
  }
}
