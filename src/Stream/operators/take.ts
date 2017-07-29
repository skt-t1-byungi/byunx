export default async function* (iterable: AsyncIterable<any>, i: number) {
    for await (let item of iterable) {
        if (i-- <= 0) {
            return;
        }

        yield item;
    }
}