import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Buffer implements Operator {
    private buffer: any[] = [];

    constructor(private size: number) {
    }

    next(value: any, stream: Stream): void {
        this.buffer.push(value);

        if (this.buffer.length === this.size) {
            stream.next(this.buffer);

            this.buffer = [];
        }
    }

    complete(stream: Stream): void {
    }
}