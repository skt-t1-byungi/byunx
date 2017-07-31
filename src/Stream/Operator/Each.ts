import {Operator} from "./Operator";
import Stream from "../Stream";

export namespace I {
    export interface Handler {
        (value: any): void
    }
}

export default class Each implements Operator {
    constructor(private handler: I.Handler) {
    }

    next(value: any, stream: Stream): void {
        this.handler(value);

        stream.next(value);
    }

    complete(stream: Stream): void {
    }
}