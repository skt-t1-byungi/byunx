import {assert} from "chai";
import {beforeEachCreateStore} from "./heplers";


describe("Store#stream", () => {
    const stub = beforeEachCreateStore();

    describe("subscribe", () => {
        it("immediately(default)", () => {
            let capture: any = null;

            stub.stream.subscribe(({value}) => capture = value);
            assert.equal(capture, "default");

            stub.store.dispatch("update", "test");
            assert.equal(capture, "test");
        });

        it("off immediately", () => {
            let capture: any = null;

            stub.stream.subscribe(({value}) => capture = value, false);
            assert.isNull(capture);

            stub.store.dispatch("update", "test");
            assert.equal(capture, "test");
        });

        describe("nested", () => {
            it("filter -> map", () => {
                let capture: any = null;
                let calls = 0;
                stub.stream
                    .filter((v, i) => i > 0 && i % 2 === 0)
                    .map(({value}, i) => ({str: value, i}))
                    .subscribe(value => {
                        capture = value;
                        calls++;
                    });

                assert.isNull(capture);
                assert.equal(calls, 0);

                stub.store.dispatch("update", "test1");
                assert.isNull(capture);
                assert.equal(calls, 0);

                stub.store.dispatch("update", "test1");
                assert.deepEqual(capture, {str: "test1", i: 0});
                assert.equal(calls, 1);
            });

            it("map -> take", () => {
                let capture: any = null;
                let calls = 0;

                stub.stream
                    .map(({value}, i) => ({str: value, i}))
                    .take(2)
                    .subscribe(value => {
                        capture = value;
                        calls++;
                    });

                assert.deepEqual(capture, {str: "default", i: 0});
                assert.equal(calls, 1);

                stub.store.dispatch("update", "test1");
                assert.deepEqual(capture, {str: "test1", i: 1});
                assert.equal(calls, 2);

                stub.store.dispatch("update", "test2");
                assert.deepEqual(capture, {str: "test1", i: 1});
                assert.equal(calls, 2);
            });

            it("scan -> take -> reduce", () => {
                let capture: any = null;
                let calls = 0;

                stub.stream
                    .scan((prev, v, i) => {
                        return prev + i;
                    }, 0)
                    .take(3)
                    .subscribe(value => {
                        capture = value;
                        calls++;
                    });

                assert.equal(capture, 0);
                assert.equal(calls, 1);

                stub.store.dispatch("update", "test1");
                assert.equal(capture, 1);
                assert.equal(calls, 2);

                stub.store.dispatch("update", "test2");
                assert.equal(capture, 3);
                assert.equal(calls, 3);

                stub.store.dispatch("update", "test3");
                assert.equal(capture, 3);
                assert.equal(calls, 3);
            });

            it("map -> (filter, take)", () => {
                let capture1: any = null;
                let capture2: any = null;
                let calls1 = 0;
                let calls2 = 0;

                const stream = stub.stream.map(({value}, i) => ({str: value, i}));

                stream
                    .filter((v, i) => i % 2 === 0 && i > 0)
                    .subscribe(({str}) => {
                        capture1 = str;
                        calls1++;
                    }, false);

                stream
                    .take(3)
                    .subscribe(({str}) => {
                        capture2 = str;
                        calls2++;
                    }, false);

                //subscribe 시작
                stream.publish();

                assert.isNull(capture1);
                assert.equal(calls1, 0);
                assert.equal(capture2, "default");
                assert.equal(calls2, 1);

                stub.store.dispatch("update", "test1");
                assert.isNull(capture1);
                assert.equal(calls1, 0);
                assert.equal(capture2, "test1");
                assert.equal(calls2, 2);

                stub.store.dispatch("update", "test2");
                assert.equal(capture1, "test2");
                assert.equal(calls1, 1);
                assert.equal(capture2, "test2");
                assert.equal(calls2, 3);

                stub.store.dispatch("update", "test3");
                assert.equal(capture1, "test2");
                assert.equal(calls1, 1);
                assert.equal(capture2, "test2");
                assert.equal(calls2, 3);
            });
        });
    });

    describe("merge", () => {
        const stub2 = beforeEachCreateStore();

        it("immediately", () => {
            let capture: any = null;
            let calls = 0;

            stub.stream.merge(stub2.stream)
                .subscribe(({value}) => {
                    capture = value;
                    calls++;
                });

            assert.equal(capture, "default");
            assert.equal(calls, 2);

            stub.store.dispatch("update", "test1");

            assert.equal(capture, "test1");
            assert.equal(calls, 3);

            stub2.store.dispatch("update", "test2");

            assert.equal(capture, "test2");
            assert.equal(calls, 4);
        });

        it("off immediately", () => {
            let capture: any = null;
            let calls = 0;

            stub.stream.merge(stub2.stream)
                .subscribe(({value}) => {
                    capture = value;
                    calls++;
                }, false);

            assert.isNull(capture);
            assert.equal(calls, 0);

            stub.store.dispatch("update", "test1");

            assert.equal(capture, "test1");
            assert.equal(calls, 1);

            stub2.store.dispatch("update", "test2");

            assert.equal(capture, "test2");
            assert.equal(calls, 2);
        });

        describe("nested", () => {
            it("(s1 + s2) -> (filter, take)", () => {
                let capture1: any = null;
                let capture2: any = null;
                let calls1 = 0;
                let calls2 = 0;

                const stream = stub.stream.merge(stub2.stream);

                stream
                    .filter((v, i) => i % 2 === 0 && i > 0)
                    .subscribe(({value}) => {
                        capture1 = value;
                        calls1++;
                    }, false);

                stream
                    .take(3)
                    .subscribe(({value}) => {
                        capture2 = value;
                        calls2++;
                    }, false);

                assert.isNull(capture1);
                assert.equal(calls1, 0);
                assert.isNull(capture2);
                assert.equal(calls2, 0);

                stream.publish();
                assert.isNull(capture1);
                assert.equal(calls1, 0);
                assert.equal(capture2, "default");
                assert.equal(calls2, 2);

                stub.store.dispatch("update", "test1");
                assert.equal(capture1, "test1");
                assert.equal(calls1, 1);
                assert.equal(capture2, "test1");
                assert.equal(calls2, 3);

                stub2.store.dispatch("update", "test2");
                assert.equal(capture1, "test1");
                assert.equal(calls1, 1);
                assert.equal(capture2, "test1");
                assert.equal(calls2, 3);
            });

            it("(s1.filter + s2.map) -> scan", () => {
                let capture1: any = null;
                let capture2: any = null;
                let calls = 0;

                const stream1 = stub.stream
                    .filter((v, i) => i % 2 === 0 && i > 0);

                const stream2 = stub2.stream
                    .map((v, i) => ({value: i}));

                stream1
                    .merge(stream2)
                    .scan((prev, {value}, i) => ({i, value}), 0)
                    .subscribe(({value, i}) => {
                        capture1 = value;
                        capture2 = i;
                        calls++;
                    });

                assert.equal(capture1, 0);
                assert.equal(capture2, 0);
                assert.equal(calls, 1);

                stub.store.dispatch("update", "test1");
                assert.equal(capture1, 0);
                assert.equal(capture2, 0);
                assert.equal(calls, 1);

                stub2.store.dispatch("update", "test2");
                assert.equal(capture1, 1);
                assert.equal(capture2, 1);
                assert.equal(calls, 2);

                stub.store.dispatch("update", "test3");
                assert.equal(capture1, "test3");
                assert.equal(capture2, 2);
                assert.equal(calls, 3);
            });

            it("s1.(take -> last) + s2.flatMap", () => {
                let capture: any = null;
                let calls = 0;

                stub.stream
                    .take(3)
                    .last()
                    .merge(stub2.stream)
                    .flatMap(({value}) => [value, value])
                    .subscribe(value => {
                        capture = value;
                        calls++;
                    });

                assert.equal(capture, "default");
                assert.equal(calls, 2);

                stub.store.dispatch("update", "test1");
                stub.store.dispatch("update", "test2");
                assert.equal(capture, "test2");
                assert.equal(calls, 4);

                stub2.store.dispatch("update", "test3");
                assert.equal(capture, "test3");
                assert.equal(calls, 6);

                stub.store.dispatch("update", "test4");
                assert.equal(capture, "test3");
                assert.equal(calls, 6);
            });
        })
    });

    describe("zip", () => {
        const stub2 = beforeEachCreateStore();

        it("immediately", () => {
            let capture: any = null;
            let calls = 0;

            stub.stream
                .map(({value}) => value)
                .zip(stub2.stream.map(({value}) => value))
                .subscribe(value => {
                    capture = value;
                    calls++;
                });

            assert.deepEqual(capture, ["default", "default"]);
            assert.equal(calls, 1);

            stub.store.dispatch("update", "store1.update1");
            stub.store.dispatch("update", "store1.update2");
            stub2.store.dispatch("update", "store2.update1");

            assert.deepEqual(capture, ["store1.update1", "store2.update1"]);
            assert.equal(calls, 2);

            stub2.store.dispatch("update", "store2.update2");
            assert.deepEqual(capture, ["store1.update2", "store2.update2"]);
            assert.equal(calls, 3);
        });
    });
});