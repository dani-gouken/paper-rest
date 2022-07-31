enum HttpMethod {
    POST,
    GET,
    PUT,
    PATCH,
    DELETE,
    OPTIONS,
    TRACE
}

class Ressource implements Identifiable {
    protected query: Record<string, string> = {};
    protected headers: Header[] = [];

    constructor(
        public readonly id: Id,
        protected url: string,
        protected method: HttpMethod = HttpMethod.GET,
    ) {

    }
    getId(): Id {
        return this.id;
    }

    public setMethod(method: HttpMethod): Ressource {
        this.method = method;
        return this;
    }
}