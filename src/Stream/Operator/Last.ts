import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Last implements Operator {
    private lastValue: any;

    next(value: any, stream: Stream): void {
        this.lastValue = value;
    }

    complete(stream: Stream): void {
        stream.next(this.lastValue);

        stream.complete();
    }
}