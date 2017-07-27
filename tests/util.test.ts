import {array_remove, deepcopy, deepfreeze, object_each, object_get} from "../src/util.js";
import {assert} from "chai";

describe("utils", () => {
    describe("deepcopy", () => {
        const obj = {a: 1, b: 1, c: {a: 11, b: 22, c: 33}};
        let copied: typeof obj;

        beforeEach(() => {
            copied = deepcopy(obj);
        });

        it("deep equal", () => {
            assert.deepEqual(copied, obj);
        });

        it("immutable", () => {
            assert.equal(obj.a, copied.a);
            copied.a = 44;
            assert.notEqual(obj.a, copied.a);
        });

        it("deep immutable", () => {
            assert.equal(obj.c.a, copied.c.a);
            copied.c.a = 55;
            assert.notEqual(obj.c.a, copied.c.a);
        });
    });

    describe("deepfreeze", () => {
        const obj = deepfreeze({a: {b: {c: 1}}});

        it("freeze", () => {
            assert.isFrozen(obj);
        });

        it("child freeze", () => {
            assert.isFrozen(obj.a);
            assert.isFrozen(obj.a.b);
            assert.isFrozen(obj.a.b.c);
        });
    });

    describe("object_get", () => {
        const obj = {
            aa: 11,
            bb: 22,
            cc: {a: 33, b: [3, 5, 6, 2]},
            dd: {
                bb: {dd: {w: "value1"}},
                bb2: {aa: 3}
            }
        };

        it("get value in object ", () => {
            assert.equal(object_get(obj, 'cc.a'), 33);
            assert.equal(object_get(obj, 'dd.bb.dd.w'), 'value1');
        });

        it("get value in array", () => {
            assert.equal(object_get(obj, 'cc.b.0'), 3);
            assert.equal(object_get(obj, 'cc.b.1'), 5);
        });

        it("default value", () => {
            assert.isNull(object_get(obj, 'cc.b.0.33'));
            assert.equal(object_get(obj, 'cc.b.0.33', "default"), "default");
            assert.deepEqual(object_get(obj, 'aa.cc.bb.33', []), []);
        });
    });

    describe("array_remove", () => {
        let arr: any[];

        beforeEach(() => {
            arr = [1, 3, 4, 4, 56, 2];
        });

        it("remove", () => {
            array_remove(arr, 4);
            assert.deepEqual(arr, [1, 3, 56, 2]);
        });

        it("multiple remove", () => {
            array_remove(arr, 1, 4);
            assert.deepEqual(arr, [3, 56, 2]);
        });
    });

    describe("object_each", () => {
        let obj = {a: 1, b: 2, c: 3};

        it('base loop', () => {
            let values: any[] = [];
            let keys: any[] = [];

            object_each(obj, (val, key) => {
                values.push(val);
                keys.push(key);
            });

            assert.deepEqual(values, [1, 2, 3]);
            assert.deepEqual(keys, ['a', 'b', 'c']);
        });
    });
});


