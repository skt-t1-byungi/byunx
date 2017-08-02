import Store from "../src/Store";
import Builder from "../src/Stream/Builder";

export function beforeEachCreateStore() {
    const data = {value: "default"};

    interface Stub {
        data: typeof data,
        store: Store<typeof data>,
        stream: Builder
    }

    const stub = {data} as Stub;

    beforeEach(() => {
        stub.store = new Store(stub.data);
        stub.stream = stub.store.stream();

        stub.store.addAction("update", function (value) {
            this.value = value;
        });
    });

    return stub;
}