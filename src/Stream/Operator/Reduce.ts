import {Operator} from "./Operator";
import Stream from "../Stream";

export namespace I {
    export interface Handler {
        (prevResult: any, value: any): any
    }
}

export default class Reduce implements Operator {
    private prevResult: any;

    constructor(private handler: I.Handler, initValue?: any) {
        this.prevResult = initValue;
    }

    next(value: any, stream: Stream): void {
        const newValue = this.handler(this.prevResult, value);

        this.prevResult = newValue;

        stream.next(newValue);
    }

    complete(stream: Stream): void {
    }
}