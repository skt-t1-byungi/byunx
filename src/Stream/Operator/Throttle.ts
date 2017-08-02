import {Operator} from "./Operator";
import Stream from "../Stream";

export default class Throttle implements Operator {
    private previousTime: number = 0;

    private recentValue?: any;

    private timeout: number | null = null;

    constructor(private wait: number = 100) {
    }

    next(value: any, stream: Stream): void {
        const now = Date.now();
        this.recentValue = value;

        if (now > this.previousTime + this.wait) {
            stream.next(value);
            this.previousTime = now;
        } else if (!this.timeout) {
            this.timeout = setTimeout(
                () => {
                    stream.next(this.recentValue);

                    if (this.timeout) {
                        clearTimeout(this.timeout);
                        this.timeout = null;
                    }
                },
                this.previousTime + this.wait - now
            );
        }
    }

    complete(stream: Stream): void {
    }
}