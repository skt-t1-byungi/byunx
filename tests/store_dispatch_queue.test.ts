import Store from "../src/Store";
import {assert} from "chai";

describe("Store#queue", () => {
    const data = {a: 1, b: 2, c: 3};
    let store: Store<typeof data>;

    beforeEach(() => {
        store = new Store(data);

        store.addActions({
            updateA(v) {
                this.a = v;
            },
            updateB(v) {
                this.b = v;
            },
            updateC(v) {
                this.c = v;
            }
        });
    });

    it("base", (done) => {
        let capture: any = null;
        let calls = 0;

        store.stream()
            .subscribe((value) => {
                capture = value;
                calls++;
            });

        assert.deepEqual(capture, {a: 1, b: 2, c: 3});
        assert.equal(calls, 1);

        store.dispatchQ("updateA", 3);
        store.dispatchQ("updateB", 4);
        store.dispatchQ("updateC", 5);

        assert.equal(calls, 1);

        setTimeout(() => {
            assert.deepEqual(capture, {a: 3, b: 4, c: 5});
            assert.equal(calls, 2);
            done();
        }, 10);
    });

    it("after event", (done) => {
        let captureA: any = null;
        let captureB: any = null;
        let calls = 0;

        store.on("updateA", ({data: {a}}) => {
            captureA = a;
            calls++;
        });
        store.on("updateB", ({data: {b}}) => {
            captureB = b;
            calls++;
        });

        store.dispatchQ("updateA", 3);
        store.dispatchQ("updateB", 4);

        setTimeout(() => {
            assert.equal(captureA, 3);
            assert.equal(captureB, 4);
            assert.equal(calls, 2);
            done();
        }, 10);
    });
});