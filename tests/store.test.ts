import Store, {I} from "../src/Store";
import {assert} from "chai";
import Builder from "../src/Stream/Builder";

describe("Store", () => {
    const store = new Store({
        a: 1, b: 2, c: [1, 2, 3], d: {a: {b: {c: 4}}}
    });

    describe("get", () => {
        it("base", () => {
            assert.equal(store.get('a'), 1);
            assert.equal(store.get('c.0'), 1);
            assert.equal(store.get('d.a.b.c'), 4);
        });

        it("immutable", () => {
            assert.isFrozen(store.get('d.a.b.c'));
        });
    });

    describe("action", () => {
        const store = new Store({});

        it("add", () => {
            assert.isFalse(store.hasAction("test"));
            store.addAction("test", () => null);
            assert.isTrue(store.hasAction("test"));
        });

        it("multiple add", () => {
            assert.isFalse(store.hasAction("test1"));
            assert.isFalse(store.hasAction("test2"));

            store.addActions({
                test1() {
                },
                test2() {
                }
            });

            assert.isTrue(store.hasAction("test1"));
            assert.isTrue(store.hasAction("test2"));
        })
    });

    describe("dispatch", () => {
        const store = new Store({value: "default"});

        store.addAction("update", function (value) {
            this.value = value;
        });

        it("update value", () => {
            assert.equal(store.get("value"), "default");
            store.dispatch("update", 5);
            assert.equal(store.get("value"), 5);
        });
    });

    describe("on", () => {
        const data = {value: "default"};
        let store: Store<typeof data>;

        beforeEach(() => {
            store = new Store(data);

            store.addAction("update", function (value) {
                this.value = value;
            });
        });

        it("trigger", () => {
            let called = false;
            let noCalled = false;

            store.on("update", () => called = true);
            store.on("do not exec", () => noCalled = true);

            store.dispatch("update", "test");

            assert.isTrue(called);
            assert.isFalse(noCalled);
        });

        it("event object", () => {
            type Event = I.Event<typeof data>;
            let capture: Event | null = null;

            store.on("update", (event) => {
                capture = event;
            });
            store.dispatch("update", "test");

            assert.deepEqual(capture, {store: store, name: "update", args: ["test"], data: {value: "test"}});
            assert.strictEqual(capture && (capture as Event).store, store);
            assert.isFrozen(capture && (capture as Event).data);
        });

        it("trigger on before dispatch", () => {
            let capture = "before capture";

            store.on("update:before", ({data}) => capture = data.value);
            store.dispatch("update", "test");

            assert.equal(capture, "default");
        });

        it("trigger on global before dispatch", () => {
            let capture = "before capture";

            store.on("*:before", ({data}) => capture = data.value);
            store.dispatch("update", "test");

            assert.equal(capture, "default");
        });

        it("trigger on global dispatch", () => {
            let capture1 = "before capture";
            let capture2 = "before capture";

            store.on("*", ({data}) => capture1 = data.value);
            store.on(({data}) => capture2 = data.value);
            store.dispatch("update", "test");

            assert.equal(capture1, "test");
            assert.equal(capture2, "test");
        });
    });

    describe("off", () => {
        const data = {value: "default"};
        let store: Store<typeof data>;

        beforeEach(() => {
            store = new Store(data);
        });

        it("by action name", () => {
            let called1 = false;
            let called2 = false;

            store.on("test", () => called1 = true);
            store.on("test", () => called2 = true);
            store.dispatch("test");

            assert.isTrue(called1);
            assert.isTrue(called2);

            //초기화
            called1 = called2 = false;

            store.off("test");
            store.dispatch("test");

            assert.isFalse(called1);
            assert.isFalse(called2);
        });

        it("by handler", () => {
            let called1 = false;
            let called2 = false;
            const handler = () => called1 = true;

            store.on("test", handler);
            store.on("test", () => called2 = true);
            store.dispatch("test");

            assert.isTrue(called1);
            assert.isTrue(called2);

            //초기화
            called1 = called2 = false;

            store.off(handler);
            store.dispatch("test");

            assert.isFalse(called1);
            assert.isTrue(called2);
        });

        it("by action name and handler", () => {
            let called1 = false;
            let called2 = false;
            const handler1 = () => called1 = true;
            const handler2 = () => called2 = true;

            store.on("test", handler1);
            store.on("test", handler2);
            store.dispatch("test");

            assert.isTrue(called1);
            assert.isTrue(called2);

            //초기화
            called1 = called2 = false;

            store.off("test", handler1);
            store.off("other", handler2);
            store.dispatch("test");

            assert.isFalse(called1);
            assert.isTrue(called2);
        });
    });

    describe("stream", () => {
        const data = {value: "default"};
        let store: Store<typeof data>;
        let stream: Builder;

        beforeEach(() => {
            store = new Store(data);
            stream = store.stream();

            store.addAction("update", function (value) {
                this.value = value;
            });
        });

        describe("subscribe", () => {
            it("immediately(default)", () => {
                let capture: any = null;

                stream.subscribe(({value}) => {
                    capture = value;
                });
                assert.equal(capture, "default");

                store.dispatch("update", "test");
                assert.equal(capture, "test");
            });

            it("not immediately", () => {
                let capture: any = null;

                stream.subscribe(({value}) => {
                    capture = value;
                }, false);

                assert.isNull(capture);

                store.dispatch("update", "test");
                assert.equal(capture, "test");
            });
        });

        it("map", () => {
            let capture1: any = null;
            let capture2: any = null;

            stream
                .map((v, i) => {
                    return {i, str: v.value};
                })
                .subscribe(({i, str}) => {
                    capture1 = i;
                    capture2 = str;
                });

            assert.equal(capture1, 0);
            assert.equal(capture2, "default");

            store.dispatch("update", "test");

            assert.equal(capture1, 1);
            assert.equal(capture2, "test");
        });

        it("map & filter", () => {
            let capture1: any = null;
            let capture2: any = null;
            let calls1 = 0;
            let calls2 = 0;

            stream
                .map((v, i) => {
                    calls1++;
                    return {i, str: v.value};
                })
                .filter((v, i) => {
                    calls2++;
                    return i % 2 === 0 && i > 0;
                })
                .subscribe(({i, str}) => {
                    capture1 = i;
                    capture2 = str;
                });

            assert.isNull(capture1);
            assert.isNull(capture2);
            assert.equal(calls1, 1);
            assert.equal(calls2, 1);

            store.dispatch("update", "test");

            assert.isNull(capture1);
            assert.isNull(capture2);
            assert.equal(calls1, 2);
            assert.equal(calls2, 2);

            store.dispatch("update", "test");

            assert.equal(capture1, 2);
            assert.equal(capture2, "test");
            assert.equal(calls1, 3);
            assert.equal(calls2, 3);
        });
    });
});