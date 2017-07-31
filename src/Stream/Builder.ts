import Drop from "./Operator/Drop"
import Each, {I as EachI} from "./Operator/Each";
import Reduce, {I as ReduceI} from "./Operator/Reduce";
import Map, {I as MapI} from "./Operator/Map";
import Filter, {I as FilterI} from "./Operator/Filter";
import Take from "./Operator/Take"
import Stream from "./Stream";
import {Operator} from "./Operator/Operator";
import Store from "../Store";

export default class Builder {

    constructor(private streams: Stream[], private store: Store<any>) {
    }

    drop(amount: number) {
        return this.withOperator(new Drop(amount));
    }

    filter(handler: FilterI.Handler) {
        return this.withOperator(new Filter(handler));
    }

    map(handler: MapI.Handler) {
        return this.withOperator(new Map(handler));
    }

    reduce(handler: ReduceI.Handler, initValue: any) {
        return this.withOperator(new Reduce(handler, initValue));
    }

    take(limit: number) {
        return this.withOperator(new Take(limit));
    }

    subscribe(handler: EachI.Handler, immediately: boolean = true) {
        (this.withOperator(new Each(handler))).build();

        if (immediately) {
            this.store.callStreamNext();
        }

        return this;
    }

    private withOperator(operator: Operator) {
        return this.withStream(new Stream(operator));
    }

    private withStream(stream: Stream) {
        return new Builder([...this.streams, stream], this.store);
    }

    private build() {
        this.streams
            .reduce((parent: Stream | null, stream) => {
                if (parent) {
                    parent.addChildren(stream);
                }

                return stream;
            }, null);
    }
}