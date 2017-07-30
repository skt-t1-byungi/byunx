import Stream from "./Stream";
import {array_remove} from "../util.js";

export namespace I {
    export interface ParentStream {
        addChildren(children: Stream): void;

        removeChildren(children: Stream): void;

        fire(value: any): void;
    }
}

export default class RootStream implements I.ParentStream {
    protected childrens: Stream[] = [];

    addChildren(children: Stream) {
        this.childrens.push(children);
    }

    removeChildren(children: Stream) {
        array_remove(this.childrens, children);
    }

    fire(value: any) {
        for (let children of this.childrens) {
            children.next(value);
        }
    }
}