import Drop from "./Operator/Drop"
import Each, {I as EachI} from "./Operator/Each";
import Reduce, {I as ReduceI} from "./Operator/Reduce";
import Map, {I as MapI} from "./Operator/Map";
import Filter, {I as FilterI} from "./Operator/Filter";
import Take from "./Operator/Take"
import Stream from "./Stream";
import {Operator} from "./Operator/Operator";
import {I as StreamI} from "./RootStream";

export default class Builder {
    constructor(private streams: StreamI.ParentStream[]) {
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

    subscribe(handler: EachI.Handler) {
        (this.withOperator(new Each(handler))).build();

        return this;
    }

    private withOperator(operator: Operator) {
        return this.withStream(new Stream(operator));
    }

    private withStream(stream: Stream) {
        return new Builder([...this.streams, stream]);
    }

    private build() {
        this.streams
            .reverse()
            .reduce((previousStream: StreamI.ParentStream | null, stream) => {
                if (previousStream) {
                    (previousStream as Stream).connect(stream);
                }
                return stream;
            }, null);
    }
}