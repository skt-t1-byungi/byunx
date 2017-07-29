export namespace I {
    export interface Handler {
        (v: any, k: number): any
    }
}

export default async function* (iterable: AsyncIterable<any>, fn: I.Handler) {
    let i = 0;
    for await (let value of iterable) {
        yield fn(value, i++);
    }
}