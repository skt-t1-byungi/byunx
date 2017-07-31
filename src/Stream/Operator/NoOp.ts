import {Operator} from "./Operator";
import Stream from "../Stream";

export default class NoOp implements Operator {
    next(value: any, stream: Stream): void {
        stream.next(value);
    }

    complete(stream: Stream): void {
    }
}