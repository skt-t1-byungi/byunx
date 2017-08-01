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
        this.prevResult = this.handler(this.prevResult, value);
    }

    complete(stream: Stream): void {
        stream.next(this.prevResult);

        stream.complete();
    }
}