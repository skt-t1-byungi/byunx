import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Skip implements Operator {
    constructor(private amount: number) {
    }

    next(value: any, stream: Stream): void {
        if (--this.amount > 0) {
            return;
        }

        stream.next(value);
    }

    complete(stream: Stream): void {
    }
}