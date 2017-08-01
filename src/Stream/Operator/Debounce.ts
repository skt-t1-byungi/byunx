import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Debounce implements Operator {
    private timeout: number | null = null;

    private value: any;

    constructor(private wait: number = 100, private immediate = false) {
    }

    next(value: any, stream: Stream): void {
        if (!this.timeout && this.immediate) {
            stream.next(value);
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.timeout = setTimeout(() => {
            this.timeout = null;

            if (!this.immediate) {
                stream.next(value)
            }
        }, this.wait);
    }

    complete(stream: Stream): void {
    }
}