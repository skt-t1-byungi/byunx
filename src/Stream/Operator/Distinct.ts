import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Distinct implements Operator {
    private values: any[] = [];

    next(value: any, stream: Stream): void {
        if (this.values.indexOf(value) === -1) {
            this.values.push(value);

            stream.next(value);
        }
    }

    complete(stream: Stream): void {
    }
}