import {beforeEachCreateStore} from "../heplers";
import {assert} from "chai";

describe("operators#reduce", () => {
    const stub = beforeEachCreateStore();

    it("base", () => {
        let capture: any = null;
        let calls = 0;

        stub.stream
            .take(3)
            .reduce((p, v, i) => p + i, 5)
            .subscribe(value => {
                capture = value;
                calls++;
            });

        stub.store.dispatch("update", "1");
        assert.equal(calls, 0);
        stub.store.dispatch("update", "2");
        assert.equal(capture, 8);
        assert.equal(calls, 1);
    });

});
