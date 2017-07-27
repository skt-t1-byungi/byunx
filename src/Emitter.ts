import {array_remove, object_each} from "./util.js";

namespace I {
    export interface Handlers {
        [name: string]: Function[];
    }
}

export default class Emitter {
    private _handlers: I.Handlers = {};

    on(name: string, handler: Function): this {
        (this._handlers[name] = this._handlers[name] || []).push(handler);

        return this;
    }

    trigger(name: string, args: any[]) {
        const handlers = this._handlers[name] || [];

        for (let handler of handlers) {
            handler(...args);
        }
    }

    off(name: string, handler?: Function): this
    off(handler: Function): this
    off(name: string | Function, handler?: Function): this {
        if (typeof name === "function") {
            handler = name;

            object_each(this._handlers, (handlers) => {
                array_remove(handlers, handler);
            });
        } else if (typeof handler === "function") {
            array_remove(this._handlers[name] || [], handler);
        } else {
            delete this._handlers[name];
        }

        return this;
    }
}