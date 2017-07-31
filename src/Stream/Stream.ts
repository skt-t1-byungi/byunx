import {Operator} from "./Operator/Operator";
import {array_remove} from "../util.js";

export default class Stream {
    private completed = false;

    constructor(private operator: Operator) {
    }

    protected childrens: Stream[] = [];

    isCompleted() {
        return this.completed;
    }

    addChildren(children: Stream) {
        this.childrens.push(children);
    }

    removeChildren(children: Stream) {
        array_remove(this.childrens, children);
    }

    next(value: any) {
        const completed = this.childrens
            .slice()
            .filter(children => children.isCompleted());


        for (let children of completed) {
            this.removeChildren(children);
        }

        for (let children of this.childrens) {
            children.operateNext(value);
        }
    }

    complete() {
        this.completed = true;

        for (let children of this.childrens) {
            children.operateComplete();
        }

        this.childrens = [];
    }

    operateNext(value: any) {
        this.operator.next(value, this);
    }

    operateComplete() {
        this.operator.complete(this);
    }
}