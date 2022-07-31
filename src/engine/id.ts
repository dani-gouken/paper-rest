class Id {
    private static counter = 0;
    readonly id: number;
    constructor(
        public readonly name: string,
    ) {
        this.id = ++Id.counter;
    }
}