import ByunX, {I} from "../src/ByunX";
import {assert} from "chai";

describe("byunx", () => {
    const byunx = new ByunX({
        a: 1, b: 2, c: [1, 2, 3], d: {a: {b: {c: 4}}}
    });

    describe("get", () => {
        it("base", () => {
            assert.equal(byunx.get('a'), 1);
            assert.equal(byunx.get('c.0'), 1);
            assert.equal(byunx.get('d.a.b.c'), 4);
        });

        it("immutable", () => {
            assert.isFrozen(byunx.get('d.a.b.c'));
        });
    });

    describe("action", () => {
        const byunx = new ByunX({});

        it("add", () => {
            assert.isFalse(byunx.hasAction("test"));
            byunx.addAction("test", () => null);
            assert.isTrue(byunx.hasAction("test"));
        });

        it("multiple add", () => {
            assert.isFalse(byunx.hasAction("test1"));
            assert.isFalse(byunx.hasAction("test2"));

            byunx.addActions({
                test1() {
                },
                test2() {
                }
            });

            assert.isTrue(byunx.hasAction("test1"));
            assert.isTrue(byunx.hasAction("test2"));
        })
    });

    describe("dispatch", () => {
        const byunx = new ByunX({value: "default"});

        byunx.addAction("update", function (value) {
            this.value = value;
        });

        it("update value", () => {
            assert.equal(byunx.get("value"), "default");
            byunx.dispatch("update", 5);
            assert.equal(byunx.get("value"), 5);
        });
    });

    describe("on", () => {
        const data = {value: "default"};
        let byunx: ByunX<typeof data>;

        beforeEach(() => {
            byunx = new ByunX(data);

            byunx.addAction("update", function (value) {
                this.value = value;
            });
        });

        it("trigger", () => {
            let called = false;
            let noCalled = false;

            byunx.on("update", () => called = true);
            byunx.on("do not exec", () => noCalled = true);

            byunx.dispatch("update", "test");

            assert.isTrue(called);
            assert.isFalse(noCalled);
        });

        it("event object", () => {
            type Event = I.Event<typeof data>;
            let capture: Event | null = null;

            byunx.on("update", (event) => {
                capture = event;
            });
            byunx.dispatch("update", "test");

            assert.deepEqual(capture, {store: byunx, name: "update", args: ["test"], data: {value: "test"}});
            assert.strictEqual(capture && (capture as Event).store, byunx);
            assert.isFrozen(capture && (capture as Event).data);
        });

        it("trigger on before dispatch", () => {
            let capture = "before capture";

            byunx.on("update:before", ({data}) => capture = data.value);
            byunx.dispatch("update", "test");

            assert.equal(capture, "default");
        });

        it("trigger on global before dispatch", () => {
            let capture = "before capture";

            byunx.on("*:before", ({data}) => capture = data.value);
            byunx.dispatch("update", "test");

            assert.equal(capture, "default");
        });

        it("trigger on global dispatch", () => {
            let capture1 = "before capture";
            let capture2 = "before capture";

            byunx.on("*", ({data}) => capture1 = data.value);
            byunx.on(({data}) => capture2 = data.value);
            byunx.dispatch("update", "test");

            assert.equal(capture1, "test");
            assert.equal(capture2, "test");
        });
    });

    describe("off", () => {
        const data = {value: "default"};
        let byunx: ByunX<typeof data>;

        beforeEach(() => {
            byunx = new ByunX(data);
        });

        it("by action name", () => {
            let called1 = false;
            let called2 = false;

            byunx.on("test", () => called1 = true);
            byunx.on("test", () => called2 = true);
            byunx.dispatch("test");

            assert.isTrue(called1);
            assert.isTrue(called2);

            //초기화
            called1 = called2 = false;

            byunx.off("test");
            byunx.dispatch("test");

            assert.isFalse(called1);
            assert.isFalse(called2);
        });

        it("by handler", () => {
            let called1 = false;
            let called2 = false;
            const handler = () => called1 = true;

            byunx.on("test", handler);
            byunx.on("test", () => called2 = true);
            byunx.dispatch("test");

            assert.isTrue(called1);
            assert.isTrue(called2);

            //초기화
            called1 = called2 = false;

            byunx.off(handler);
            byunx.dispatch("test");

            assert.isFalse(called1);
            assert.isTrue(called2);
        });

        it("by action name and handler", () => {
            let called1 = false;
            let called2 = false;
            const handler1 = () => called1 = true;
            const handler2 = () => called2 = true;

            byunx.on("test", handler1);
            byunx.on("test", handler2);
            byunx.dispatch("test");

            assert.isTrue(called1);
            assert.isTrue(called2);

            //초기화
            called1 = called2 = false;

            byunx.off("test", handler1);
            byunx.off("other", handler2);
            byunx.dispatch("test");

            assert.isFalse(called1);
            assert.isTrue(called2);
        });
    });
});