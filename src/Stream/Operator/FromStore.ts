import {Operator} from "./Operator";
import Stream from "../Stream";
import Store from "../../Store";

export default class FromStore implements Operator {

    constructor(private store: Store<any>) {
    }

    next(value: any, stream: Stream): void {
        stream.next(this.store.get());
    }

    complete(stream: Stream): void {
    }
}