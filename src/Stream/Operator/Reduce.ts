import {Operator} from "./Operator";

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

    operate(value: any) {
        const newValue = this.handler(this.prevResult, value);

        this.prevResult = newValue;

        return {done: false, pass: false, value: newValue};
    }
}