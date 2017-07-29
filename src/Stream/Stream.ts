import map, {I as MapI} from "./operators/map";
import filter, {I as FilterI} from "./operators/filter";
import take from "./operators/take";

async function each(iterable: AsyncIterable<any>, fn: (v: any) => void) {
    for await (let value of iterable) {
        fn(value);
    }
}

export default class Stream {
    constructor(private iterable: AsyncIterable<any>) {
    }

    map(fn: MapI.Handler) {
        new Stream(map(this.iterable, fn));
    }

    filter(fn: FilterI.Handler) {
        new Stream(filter(this.iterable, fn));
    }

    take(i: number) {
        new Stream(take(this.iterable, i));
    }

    subscribe(fn: (v: any) => void) {
        each(this.iterable, fn);

        return this;
    }
}