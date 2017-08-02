import Store, {I} from "./Store";

export interface Definition<T extends object> {
    data: T,
    actions?: I.Actions<T>
    computed?: I.ComputedGetters<T>
}

export function createStore<T extends object>(definition: Definition<T>) {
    const store = new Store(definition.data, definition.computed);

    if (definition.actions) {
        store.addActions(definition.actions);
    }

    return store;
}