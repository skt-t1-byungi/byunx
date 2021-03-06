import {beforeEachCreateStore} from "../heplers";
import {assert} from "chai";

describe("operators#skip", () => {
    const stub = beforeEachCreateStore();

    it("skip#3", () => {
        let capture: any = null;
        let calls = 0;

        stub.stream.skip(3)
            .subscribe(({value}) => {
                capture = value;
                calls++;
            });

        stub.store.dispatch("update", 1);
        assert.equal(calls, 0);

        stub.store.dispatch("update", 2);
        assert.equal(capture, 2);
        assert.equal(calls, 1);
    });
});