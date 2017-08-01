import CombinedStream from "./CombinedStream";
import Stream from "./Stream";
import {Operator} from "./Operator/Operator";
import Builder from "./Builder";

class ZipOperator implements Operator {
    private streams: { [i: string]: any[] } = {};

    constructor(private size: number) {
        for (let i = 0; i < size; i++) {
            this.streams[i] = [];
        }
    }

    next({value, i}: { value: any, i: number }, stream: Stream): void {
        this.streams[i].push(value);

        if (this.shouldNext()) {
            stream.next(this.getZipValue());
        }
    }

    complete(stream: Stream): void {
    }

    private shouldNext() {
        for (let i = 0; i < this.size; i++) {
            if (this.streams[i].length === 0) {
                return false;
            }
        }

        return true;
    }

    public getZipValue() {
        const values = [];

        for (let i = 0; i < this.size; i++) {
            values[i] = this.streams[i].shift();
        }

        return values;
    }
}

export default class ZippedStream extends CombinedStream {
    private zipStream: Stream;

    constructor(builders: Builder[]) {
        super(builders);

        this.zipStream = new Stream(new ZipOperator(builders.length));
    }

    addChildren(children: Stream) {
        for (let i in this.builders) {
            let builder = this.builders[i];

            builder = builder.map(value => ({value, i})).build();

            builder.getLastStream().addChildren(this.zipStream);
        }

        this.zipStream.addChildren(children);
    }
}