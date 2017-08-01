import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Pluck implements Operator {
    constructor(private property: string) {
    }

    next(value: any, stream: Stream): void {
        stream.next(value[this.property]);
    }

    complete(stream: Stream): void {
    }
}