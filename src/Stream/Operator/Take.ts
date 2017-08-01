import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Take implements Operator {
    constructor(private limit: number) {
    }

    next(value: any, stream: Stream): void {
        if (this.limit-- > 0) {
            stream.next(value);
        }

        if (this.limit > 0) {
            return;
        }

        stream.complete();
    }

    complete(stream: Stream): void {
    }
}