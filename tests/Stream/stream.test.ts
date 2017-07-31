import Stream from "../../src/Stream/Stream";
import {Operator} from "../../src/Stream/Operator/Operator";
import {assert} from "chai";

describe("Stream/Stream", () => {
    let parent: Stream;
    let children: Stream;
    let capture: any;
    let doneAndPass: { done: boolean, pass: boolean } = {done: false, pass: false};

    beforeEach(() => {
        parent = new Stream({} as Operator);

        children = new Stream(new class implements Operator {
            operate(value: any) {
                capture = value;
                return {...doneAndPass, value: value};
            }
        });

        children.connect(parent);
    });

    it("connect, event propagation", () => {
        parent.next("test");
        assert.equal(capture, "test");

        parent.next(1212);
        assert.equal(capture, 1212);
    });

    it("stop", () => {
        children.complete();
        parent.next("test");

        assert.notEqual(capture, "test");
    });

    describe("operateNext result", () => {
        let capture2: any;
        let grandChildren: Stream;

        beforeEach(() => {
            grandChildren = new Stream(new class implements Operator {
                operate(value: any) {
                    capture2 = value;
                    return {done: false, pass: false, value: value};
                }
            });

            grandChildren.connect(children);
        });

        afterEach(() => {
            grandChildren.complete();
        });

        it("done -> complete", () => {
            parent.next("test");
            assert.equal(capture2, "test");

            capture2 = null;
            doneAndPass = {done: true, pass: false};

            parent.next("test");
            assert.notEqual(capture2, "test");

            capture2 = null;
            doneAndPass = {done: false, pass: false};

            parent.next("test");
            assert.notEqual(capture2, "test");
        });

        it("pass -> complete propagation", () => {
            parent.next("test");
            assert.equal(capture2, "test");

            capture2 = null;
            doneAndPass = {done: false, pass: true};

            parent.next("test");
            assert.notEqual(capture2, "test");

            capture2 = null;
            doneAndPass = {done: false, pass: false};

            parent.next("test");
            assert.equal(capture2, "test");
        });
    });
});