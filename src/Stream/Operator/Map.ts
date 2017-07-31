import {Operator} from "./Operator";
import Stream from "../Stream";

export namespace I {
    export interface Handler {
        (value: any, i: number): any
    }
}

export default class Map implements Operator {
    private i = 0;

    constructor(private handler: I.Handler) {
    }

    next(value: any, stream: Stream): void {
        stream.next(this.handler(value, this.i++));
    }

    complete(stream: Stream): void {
    }
}