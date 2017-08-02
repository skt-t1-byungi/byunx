import {Operator} from "./Operator";
import Stream from "../Stream";
import {object_get} from "../../util.js";

export default class Pluck implements Operator {
    constructor(private key: string) {
    }

    next(value: object, stream: Stream): void {
        stream.next(object_get(value, this.key));
    }

    complete(stream: Stream): void {
    }
}