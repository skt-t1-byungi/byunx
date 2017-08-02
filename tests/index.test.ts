import {createStore} from "../src/index";
import {assert} from "chai";

describe("index#", () => {
    it("createStore", () => {
        const store = createStore({
            data: {
                a: 1,
                b: 2
            },
            actions: {
                updateA(v) {
                    this.a = v;
                },
                updateB(v) {
                    this.b = v;
                }
            },
            computed: {
                sum() {
                    return this.a + this.b;
                }
            }
        });

        assert.equal(store.get("a"), 1);
        assert.equal(store.get("b"), 2);
        assert.equal(store.get("sum"), 3);

        store.dispatch("updateA", 3);

        assert.equal(store.get("a"), 3);
        assert.equal(store.get("sum"), 5);
    });
});