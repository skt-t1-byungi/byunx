import RootStream, {I} from "./RootStream";
import {Operator} from "./Operator/Operator";

export default class Stream extends RootStream {
    private parent: I.ParentStream | null;

    constructor(private operator: Operator) {
        super();
    }

    connect(parent: I.ParentStream) {
        if (!this.parent) {
            this.parent = parent;
            parent.addChildren(this);
        }
    }

    disconnect() {
        if (this.parent) {
            this.parent.removeChildren(this);
            this.parent = null;
        }
    }

    next(value: any) {
        const {done, pass, value: newValue} = this.operator.operate(value);

        if (!pass) {
            return;
        } else if (done) {
            this.disconnect()
        } else {
            this.fire(newValue)
        }
    }
}