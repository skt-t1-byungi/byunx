import {Operator} from "./Operator";

export namespace I {
    export interface Handler {
        (value: any): void
    }
}

export default class Each implements Operator {
    constructor(private handler: I.Handler) {
    }

    operate(value: any) {
        this.handler(value);

        return {done: false, pass: false, value};
    }
}