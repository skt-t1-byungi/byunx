import Skip from "./Operator/Skip"
import {Operator} from "./Operator/Operator";
import Each, {I as EachI} from "./Operator/Each";
import Reduce, {I as ReduceI} from "./Operator/Reduce";
import Map, {I as MapI} from "./Operator/Map";
import Filter, {I as FilterI} from "./Operator/Filter";
import Take from "./Operator/Take"
import FlatMap, {I as FlatMapI} from "./Operator/FlatMap";
import Scan, {I as ScanI} from "./Operator/Scan";
import Stream from "./Stream";
import CombinedStream from "./CombinedStream";
import Last from "./Operator/Last";
import ZippedStream from "./ZippedStream";
import Buffer from "./Operator/Buffer";
import Debounce from "./Operator/Debounce";
import Delay from "./Operator/Delay";
import Distinct from "./Operator/Distinct";
import Pluck from "./Operator/Pluck";
import DistinctUntilChanged from "./Operator/DistinctUntilChanged";
import Throttle from "./Operator/Throttle";
import {array_last} from "../util.js";
import {OperateNextStream} from "./OperateNextStream";

export default class Builder {
    constructor(private streams: OperateNextStream[]) {
    }

    skip(amount: number) {
        return this.withOperator(new Skip(amount));
    }

    filter(handler: FilterI.Handler) {
        return this.withOperator(new Filter(handler));
    }

    map(handler: MapI.Handler) {
        return this.withOperator(new Map(handler));
    }

    reduce(handler: ReduceI.Handler, initValue?: any) {
        return this.withOperator(new Reduce(handler, initValue));
    }

    take(limit: number) {
        return this.withOperator(new Take(limit));
    }

    last() {
        return this.withOperator(new Last());
    }

    flatMap(handler: FlatMapI.Handler) {
        return this.withOperator(new FlatMap(handler));
    }

    scan(handler: ScanI.Handler, initValue?: any) {
        return this.withOperator(new Scan(handler, initValue));
    }

    buffer(size: number) {
        return this.withOperator(new Buffer(size));
    }

    debounce(wait: number = 100, immediate = false) {
        return this.withOperator(new Debounce(wait, immediate));
    }

    delay(milliseconds: number) {
        return this.withOperator(new Delay(milliseconds));
    }

    distinct() {
        return this.withOperator(new Distinct());
    }

    distinctUntilChanged() {
        return this.withOperator(new DistinctUntilChanged())
    }

    pluck(key: string) {
        return this.withOperator(new Pluck(key));
    }

    throttle(milliseconds: number) {
        return this.withOperator(new Throttle(milliseconds))
    }

    merge(builder: Builder) {
        const combinedStream = new CombinedStream([this, builder]);

        return new Builder([combinedStream]);
    }

    zip(...builders: Builder[]) {
        const zippedStream = new ZippedStream([this, ...builders]);

        return new Builder([zippedStream]);
    }

    subscribe(handler: EachI.Handler, immediately: boolean = true) {
        const builder = (this.withOperator(new Each(handler))).build();

        if (immediately) {
            builder.publish();
        }

        return builder;
    }

    private withOperator(operator: Operator) {
        return this.withStream(new Stream(operator));
    }

    private withStream(stream: Stream) {
        return new Builder([...this.streams, stream]);
    }

    build() {
        this.streams
            .reduce((parent: OperateNextStream | null, stream) => {
                if (parent) {
                    parent.addChildren(stream);
                }

                return stream;
            }, null);

        return this;
    }

    getLastStream() {
        return array_last(this.streams);
    }

    publish() {
        this.streams[0].operateNext();

        return this;
    }
}