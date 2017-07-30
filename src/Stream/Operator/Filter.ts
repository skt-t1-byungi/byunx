import {Operator} from "./Operator";

export namespace I {
    export interface Handler {
        (value: any): boolean
    }
}

export default class Filter implements Operator {
    constructor(private handler: I.Handler) {
    }

    operate(value: any) {
        if (this.handler(value)) {
            return {done: false, pass: false, value};
        }

        return {done: false, pass: true, value: null};
    }
}