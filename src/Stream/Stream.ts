import {Operator} from "./Operator/Operator";
import {array_remove} from "../util";
import {OperateNextStream} from "./OperateNextStream";

export default class Stream implements OperateNextStream {
    private completed = false;

    constructor(private operator: Operator) {
    }

    protected childrens: Stream[] = [];

    isCompleted() {
        return this.completed;
    }

    addChildren(children: Stream) {
        if (this.childrens.indexOf(children) === -1) {
            this.childrens.push(children);
        }
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

    operateNext(value?: any) {
        this.operator.next(value, this);
    }

    operateComplete() {
        this.operator.complete(this);
    }
}