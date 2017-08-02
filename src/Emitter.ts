import {array_remove, object_each} from "./util.js";

namespace I {
    export interface Listeners {
        [name: string]: Function[];
    }
}

export default class Emitter {
    private _listeners: I.Listeners = {};

    on(name: string, listener: Function): this {
        (this._listeners[name] = this._listeners[name] || []).push(listener);

        return this;
    }

    trigger(name: string, args: any[]) {
        const handlers = this._listeners[name] || [];

        for (let listener of handlers) {
            listener(...args);
        }
    }

    off(name: string, listener?: Function): this
    off(listener: Function): this
    off(name: string | Function, listener?: Function): this {
        if (typeof name === "function") {
            listener = name;

            object_each(this._listeners, (handlers) => {
                array_remove(handlers, listener);
            });
        } else if (typeof listener === "function") {
            array_remove(this._listeners[name] || [], listener);
        } else {
            delete this._listeners[name];
        }

        return this;
    }
}