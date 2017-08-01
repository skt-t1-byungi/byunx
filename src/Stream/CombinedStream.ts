import Builder from "./Builder";
import {OperateNextStream} from "./OperateNextStream";
import Stream from "./Stream";

export default class CombinedStream implements OperateNextStream {
    constructor(protected builders: Builder[]) {
    }

    addChildren(children: Stream) {
        for (let builder of this.builders) {
            builder.build();

            builder.getLastStream().addChildren(children);
        }
    }

    operateNext() {
        for (let builder of this.builders) {
            builder.publish();
        }
    }
}