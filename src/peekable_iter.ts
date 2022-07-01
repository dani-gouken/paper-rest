export class PeekableIter<T> {
    private position: number = 0;
    private nextCb?: { (item: T): void }

    constructor(private items: T[]) {
    }

    onMoveNext(fn: { (char: T): void }) {
        this.nextCb = fn;
    }

    peek(): T | null {
        const peeked = this.items[this.position++];
        if (peeked) {
            this.nextCb?.call(this, peeked);
        }
        return peeked;
    }

    nextIf(predicate: { (value: T): boolean }): boolean {
        const next = this.next();
        if (!next) {
            return false;
        }
        if (predicate(next)) {
            this.peek();
            return true;
        }
        return false;
    }

    empty(): boolean {
        return this.items.length == 0;
    }
    exhausted(): boolean {
        return this.items.length == this.position;
    }
    current(): T | null {
        return this.items[this.position];
    }

    get(position: number): T | null {
        return this.items[position] ?? null;
    }

    next(): T | null {
        return this.get(this.position + 1);
    }

    prev(): T | null {
        return this.get(this.position - 1);
    }

    is(expected: T): boolean {
        return this.current() === expected;
    }

}
