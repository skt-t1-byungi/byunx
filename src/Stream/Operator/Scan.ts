import {Operator} from "./Operator";
import Stream from "../Stream";

export namespace I {
    export interface Handler {
        (prevResult: any, value: any, i: number): any
    }
}

export default class Scan implements Operator {
    private prevResult: any;

    private i = 0;

    constructor(private handler: I.Handler, initValue?: any) {
        this.prevResult = initValue;
    }

    next(value: any, stream: Stream): void {
        const newValue = this.handler(this.prevResult, value, this.i++);

        this.prevResult = newValue;

        stream.next(newValue);
    }

    complete(stream: Stream): void {
    }
}