import {assert} from "chai";
import Store from "../src/Store";

describe("Store#", () => {
    describe("get", () => {
        const store = new Store({
            a: 1, b: 2, c: [1, 2, 3], d: {a: {b: {c: 4}}}
        });

        it("base", () => {
            assert.equal(store.get('a'), 1);
            assert.equal(store.get('c.0'), 1);
            assert.equal(store.get('d.a.b.c'), 4);
        });

        it("immutable", () => {
            assert.isFrozen(store.get('d.a.b.c'));
        });
    });

    describe("computed", () => {
        const store = new Store(
            {
                a: 1, b: 2, c: [1, 2, 3], d: {a: {b: {c: 4}}}
            },
            {
                sumPlusOne() {
                    return this.sum + 1;
                },
                sum() {
                    return this.a + this.b;
                }
            }
        );

        store.addAction("plus", function (v) {
            this.a = this.a + v
        });

        it("base", () => {
            assert.equal(store.get('sumPlusOne'), 4);
            assert.equal(store.get('sum'), 3);
        });

        it("dispatch", () => {
            store.dispatch("plus", 5);

            assert.equal(store.get('a'), 6);
            assert.equal(store.get('sumPlusOne'), 9);
            assert.equal(store.get('sum'), 8);
        });
    });
});