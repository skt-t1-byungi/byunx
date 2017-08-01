import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Delay implements Operator {
    constructor(private milliseconds: number) {
    }

    next(value: any, stream: Stream): void {
        setTimeout(() => stream.next(value), this.milliseconds)
    }

    complete(stream: Stream): void {
    }
}