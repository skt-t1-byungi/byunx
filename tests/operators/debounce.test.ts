import {beforeEachCreateStore} from "../heplers";
import {assert} from "chai";

describe("operators#debounce", () => {
    const stub = beforeEachCreateStore();

    it("base", (done) => {
        let capture: any = null;
        let calls = 0;

        stub.stream
            .debounce(300)
            .subscribe(({value}) => {
                capture = value;
                calls++;
            });

        setTimeout(() => {
            assert.equal(calls, 0);
        }, 290);

        setTimeout(() => {
            assert.equal(capture, "default");
            assert.equal(calls, 1);
            done();
        }, 310);
    });

    it("dispatch", (done) => {
        let capture: any = null;
        let calls = 0;

        stub.stream
            .debounce(300)
            .subscribe(({value}) => {
                capture = value;
                calls++;
            });

        setTimeout(() => {
            stub.store.dispatch("update", "1");
            assert.equal(calls, 0);
        }, 200);

        setTimeout(() => {
            assert.equal(calls, 0);
        }, 490);

        setTimeout(() => {
            assert.equal(calls, 1);
            assert.equal(calls, 1);
            done();
        }, 510);
    });

    it("immediate", (done) => {
        let capture: any = null;
        let calls = 0;

        stub.stream
            .debounce(300, true)
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
        }, 310);

        setTimeout(() => {
            assert.equal(capture, "2");
            assert.equal(calls, 2);
            done();
        }, 610);
    });
});