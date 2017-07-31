import Stream from "../Stream";

export interface Operator {
    next(value: any, stream: Stream): void;

    complete(stream: Stream): void;
}