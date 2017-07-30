import {Operator} from "./Operator";

export default class Take implements Operator {
    constructor(private limit: number) {
    }

    operate(value: any) {
        if (this.limit-- > 0) {
            return {done: false, pass: true, value: null};
        }

        return {done: false, pass: false, value};
    }
}