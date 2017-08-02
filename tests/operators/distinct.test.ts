import {beforeEachCreateStore} from "../heplers";
import {assert} from "chai";

describe("operators#distinct", () => {
    const stub = beforeEachCreateStore();

    it("base", () => {
        let capture: any = null;
        let calls = 0;

        stub.stream
            .pluck("value")
            .distinct()
            .subscribe(value => {
                capture = value;
                calls++;
            });

        assert.equal(capture, "default");
        assert.equal(calls, 1);

        stub.store.dispatch("update", "1");
        assert.equal(capture, "1");
        assert.equal(calls, 2);

        stub.store.dispatch("update", "2");
        assert.equal(capture, "2");
        assert.equal(calls, 3);

        stub.store.dispatch("update", "1");
        assert.equal(capture, "2");
        assert.equal(calls, 3);
    });

});
