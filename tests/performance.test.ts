import {createStore} from "../src/index";
import Store from "../src/Store";

describe("performance check", function () {
    this.timeout(3000);

    const storesNum = 10000;

    let stores: Store<object>[] = [];

    for (let i = 0; i < storesNum; i++) {
        stores.push(createStore({
            data: {a: 1, b: 2, c: 3},
            actions: {
                updateA(v) {
                    this.a = v;
                },
                updateB(v) {
                    this.b = v;
                },
                updateC(v) {
                    this.b = v;
                }
            },
            computed: {
                sum() {
                    return this.a + this.b;
                },
                test() {
                    return {sum: this.sum, a: this.a, b: this.b};
                }
            }
        }));
    }

    let i = 0;
    stores.forEach(store => store.on(({data}) => {
        let a = data.test;
        i++;
    }));

    stores.forEach(store => store.on(({data}) => {
        let a = data.test;
        // console.log(a);
        i++;
    }));

    function dispatch(name: string, ...values: any[]) {
        stores.forEach(store => {
            store.dispatch(name, ...values);
        });
    }

    it("test", () => {
        dispatch("updateA", 1000);
        dispatch("updateB", 1000);
        dispatch("updateC", 1000);

        dispatch("updateA", 1000);
        dispatch("updateB", 1000);
        dispatch("updateC", 1000);

        dispatch("updateA", 1000);
        dispatch("updateB", 1000);
        dispatch("updateC", 1000);

        dispatch("updateA", 1000);
        dispatch("updateB", 1000);
        dispatch("updateC", 1000);

        dispatch("updateA", 1000);
        dispatch("updateB", 1000);
        dispatch("updateC", 1000);

        console.info(`      ${storesNum} stores, ${i} triggers`);
    });
});