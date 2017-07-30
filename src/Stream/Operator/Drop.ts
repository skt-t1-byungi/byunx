import {Operator} from "./Operator";

export default class Drop implements Operator {
    constructor(private amount: number) {
    }

    operate(value: any) {
        if (this.amount-- > 0) {
            return {done: false, pass: true, value: null};
        }

        return {done: false, pass: false, value};
    }
}