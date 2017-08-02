import {beforeEachCreateStore} from "../heplers";
import {assert} from "chai";

describe("operators#delay", () => {
    const stub = beforeEachCreateStore();

    it("base", (done) => {
        let capture: any = null;
        let calls = 0;

        stub.stream
            .delay(300)
            .subscribe(({value}) => {
                capture = value;
                calls++;
            });

        assert.isNull(capture);
        assert.equal(calls, 0);

        setTimeout(() => {
            assert.equal(capture, "default");
            assert.equal(calls, 1);
        }, 310);

        setTimeout(() => {
            stub.store.dispatch("update", "1");
        }, 100);

        setTimeout(() => {
            assert.equal(capture, "default");
            assert.equal(calls, 1);
        }, 390);

        setTimeout(() => {
            assert.equal(capture, "1");
            assert.equal(calls, 2);

            done();
        }, 410);
    });

});
