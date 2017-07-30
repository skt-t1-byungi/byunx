import {Operator} from "./Operator";

export namespace I {
    export interface Handler {
        (value: any): any
    }
}

export default class Map implements Operator {
    constructor(private handler: I.Handler) {
    }

    operate(value: any) {
        return {done: false, pass: false, value: this.handler(value)};
    }
}