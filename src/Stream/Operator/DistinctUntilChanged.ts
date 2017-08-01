import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Distinct implements Operator {
    private previous: any;

    private first = true;

    next(value: any, stream: Stream): void {
        if (value !== this.previous || this.first) {
            this.previous = value;

            stream.next(value);
        }

        if (this.first) {
            this.first = false;
        }
    }

    complete(stream: Stream): void {
    }
}