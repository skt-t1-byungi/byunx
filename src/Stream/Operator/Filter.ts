import {Operator} from "./Operator";
import Stream from "../Stream";

export namespace I {
    export interface Handler {
        (value: any, i: number): boolean
    }
}

export default class Filter implements Operator {
    private i = 0;

    constructor(private handler: I.Handler) {
    }

    next(value: any, stream: Stream): void {
        if (this.handler(value, this.i++)) {
            return stream.next(value);
        }

        return;
    }

    complete(stream: Stream): void {
    }
}