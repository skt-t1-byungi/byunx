import {deepcopy, deepfreeze, object_each, object_get} from "./util.js"
import Emitter from "./Emitter";
import Builder from "./Stream/Builder";
import Stream from "./Stream/Stream";
import FromStore from "./Stream/Operator/FromStore";

export namespace I {
    export interface Event<T extends object> {
        store: Store<T>,
        name: string
        data: T,
        args: any[]
    }

    export interface Handler<T extends object> {
        (event: Event<T>): void
    }

    export interface Action<T extends object> {
        (this: T, ...args: any[]): void;
    }

    export interface Actions<T extends object> {
        [name: string]: Action<T>;
    }
}

export default class Store<T extends object> {
    private _data: T;

    private _readOnlyData: Readonly<T>;

    private _actions: I.Actions<T> = {};

    private _builder: Builder;

    private _rootStream: Stream = new Stream(new FromStore(this));

    private _emitter = new Emitter;

    constructor(data: T) {
        this._data = deepcopy(data);

        this.regenerateReadOnlyData();
    }

    private regenerateReadOnlyData() {
        this._readOnlyData = deepfreeze(deepcopy(this._data));
    }

    get(key?: string, defaultValue = null) {
        if (!key) {
            return this._readOnlyData;
        }

        return object_get(this._readOnlyData, key, defaultValue);
    }

    addActions(actions: { [name: string]: I.Action<T> }) {
        object_each(actions, (action, name) => {
            this.addAction(name, action);
        });
    }

    addAction(name: string, action: I.Action<T>) {
        this._actions[name] = action;
    }

    hasAction(name: string) {
        return this._actions.hasOwnProperty(name);
    }

    private doAction(name: string, args: any[]) {
        this._actions[name].apply(this._data, args);
    }

    on(name: string, handler: I.Handler<T>): this
    on(handler: I.Handler<T>): this
    on(name: string | I.Handler<T>, handler?: I.Handler<T>): this {
        if (typeof name === "function") {
            this._emitter.on("*", name);
        } else if (typeof handler === "function") {
            this._emitter.on(name, handler);
        }

        return this;
    }

    off(name: string, handler?: I.Handler<T>): this
    off(handler: I.Handler<T>): this
    off(name: string | I.Handler<T>, handler?: I.Handler<T>): this {
        if (typeof name === "function") {
            this._emitter.off(name as Function);
            return this;
        }

        this._emitter.off(name, handler);

        return this;
    }

    dispatch(name: string, ...args: any[]) {
        this.triggerHandler(`${name}:before`, args);
        this.triggerHandler(`*:before`, args);

        if (this.hasAction(name)) {
            this.doAction(name, args);

            this.regenerateReadOnlyData();
        }

        this.triggerHandler(name, args);
        this.triggerHandler("*", args);
    }

    private triggerHandler(name: string, args: any[]) {
        this.triggerHandlerByEvent(this.makeEvent(name, args));
    }

    private makeEvent(name: string, args: any[]): I.Event<T> {
        return {store: this, name, args, data: this._readOnlyData};
    }

    private triggerHandlerByEvent(event: I.Event<T>) {
        this._emitter.trigger(event.name, [event]);
    }

    stream() {
        if (!this._builder) {
            this.on(() => this._rootStream.operateNext());
            
            this._builder = new Builder([this._rootStream]);
        }

        return this._builder;
    }
};

