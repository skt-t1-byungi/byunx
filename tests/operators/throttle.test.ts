import {beforeEachCreateStore} from "../heplers";
import {assert} from "chai";

describe("operators#debounce", () => {
    const stub = beforeEachCreateStore();

    it("base", (done) => {
        let capture: any = null;
        let calls = 0;

        stub.stream
            .throttle(300)
            .subscribe(({value}) => {
                capture = value;
                calls++;
            });

        assert.equal(capture, "default");
        assert.equal(calls, 1);

        stub.store.dispatch("update", "1");

        assert.equal(capture, "default");
        assert.equal(calls, 1);

        setTimeout(() => {
            stub.store.dispatch("update", "2");
            assert.equal(calls, 1);
        }, 200);

        setTimeout(() => {
            assert.equal(capture, "2");
            assert.equal(calls, 2);
            done();
        }, 310);
    });

});