import {beforeEachCreateStore} from "../heplers";
import {assert} from "chai";

describe("operators#buffer", () => {
    const stub = beforeEachCreateStore();

    it("buffer#3", () => {
        let capture: any = null;
        let calls = 0;

        stub.stream.buffer(3)
            .subscribe((value) => {
                capture = value;
                calls++;
            });

        stub.store.dispatch("update", 1);
        assert.equal(calls, 0);

        stub.store.dispatch("update", 2);
        assert.deepEqual(capture, [{value: "default"}, {value: 1}, {value: 2}]);
        assert.equal(calls, 1);

        stub.store.dispatch("update", 3);
        assert.equal(calls, 1);

        stub.store.dispatch("update", 4);
        assert.equal(calls, 1);

        stub.store.dispatch("update", 5);

        assert.deepEqual(capture, [{value: 3}, {value: 4}, {value: 5}]);
        assert.equal(calls, 2);
    });
});