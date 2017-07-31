import {Operator} from "./Operator";
import Stream from "../Stream";

export namespace I {
    export interface Handler {
        (value: any, i: number): any
    }
}

export default class FlatMap implements Operator {
    private i = 0;

    constructor(private handler: I.Handler) {
    }

    next(value: any, stream: Stream): void {
        const result = this.handler(value, this.i++);

        if (!Array.isArray(result)) {
            stream.next(result);
            return;
        }

        for (let item of result) {
            stream.next(item);
        }
    }

    complete(stream: Stream): void {
    }
}