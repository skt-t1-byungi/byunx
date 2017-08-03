import {deepcopy, deepfreeze, object_each, object_get} from "./util"
import Emitter from "./Emitter";
import Builder from "./Stream/Builder";
import FromStore from "./Stream/Operator/FromStore";
import Stream from "./Stream/Stream";

export namespace I {
    export interface Event<T extends object> {
        store: Store<T>,
        name: string
        data: T & { [name: string]: any },
        args: any[]
    }

    export interface Listener<T extends object> {
        (event: Event<T>): void
    }

    export interface Action<T extends object> {
        (this: T, ...args: any[]): void;
    }

    export interface Actions<T extends object> {
        [name: string]: Action<T>;
    }

    export interface ComputedGetter<T extends object> {
        (this: T & { [name: string]: any }): any;
    }

    export interface ComputedGetters<T extends object> {
        [prop: string]: ComputedGetter<T>
    }

    export interface Queue {
        name: string,
        args: any[]
    }
}

export default class Store<T extends object> {
    private _data: T;

    private _readOnlyData: Readonly<T>;

    private _computedGetters: I.ComputedGetters<T>;

    private _actions: I.Actions<T> = {};

    private _queues: I.Queue[] = [];

    private _resolveQueueTimeout: number | null = null;

    private _emitter = new Emitter;

    constructor(data: T, computedGetters: I.ComputedGetters<T> = {}) {
        this._data = deepcopy(data);
        this._computedGetters = computedGetters;

        this.regenerateReadOnlyData();
    }

    private regenerateReadOnlyData() {
        this._readOnlyData = deepfreeze(this.applyComputedGetters(deepcopy(this._data)));
    }

    private applyComputedGetters(data: T) {
        const getters = this._computedGetters;

        for (let prop in getters) {
            Object.defineProperty(data, prop, {
                get: getters[prop].bind(data),
            });
        }

        return data;
    }

    get (key?: string, defaultValue?: any) {
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

    on(name: string, listener: I.Listener<T>): this
    on(listener: I.Listener<T>): this
    on(name: string | I.Listener<T>, listener?: I.Listener<T>): this {
        if (typeof name === "function") {
            this._emitter.on("*", name);
        } else if (typeof listener === "function") {
            this._emitter.on(name, listener);
        }

        return this;
    }

    off(name: string, listener?: I.Listener<T>): this
    off(listener: I.Listener<T>): this
    off(name: string | I.Listener<T>, listener?: I.Listener<T>): this {
        if (typeof name === "function") {
            this._emitter.off(name as Function);
            return this;
        }

        this._emitter.off(name, listener);

        return this;
    }

    dispatch(name: string, ...args: any[]) {
        this.triggerEvent(`*:before`, args);
        this.triggerEvent(`${name}:before`);

        if (this.hasAction(name)) {
            this.doAction(name, args);

            this.regenerateReadOnlyData();
        }

        this.triggerEvent(name, args);
        this.triggerEvent("*");
    }

    dispatchQ(name: string, ...args: any[]) {
        this._queues.push({name, args});

        if (!this._resolveQueueTimeout) {
            this._resolveQueueTimeout = setTimeout(() => this.resolveQueue(), 0);
        }
    }

    private resolveQueue() {
        this._resolveQueueTimeout = null;

        this.triggerEvent(`*:before`);

        for (let {name, args} of this._queues) {
            this.triggerEvent(`${name}:before`);

            if (this.hasAction(name)) {
                this.doAction(name, args);
            }
        }

        this.regenerateReadOnlyData();

        for (let {name, args} of this._queues) {
            this.triggerEvent(name, args);
        }

        this.triggerEvent("*");

        this._queues = [];
    }

    private triggerEvent(name: string, args: any[] = []) {
        this.triggerEventByEventObject(this.makeEventObject(name, args));
    }

    private makeEventObject(name: string, args: any[] = []): I.Event<T> {
        return {store: this, name, args, data: this.get()};
    }

    private triggerEventByEventObject(event: I.Event<T>) {
        this._emitter.trigger(event.name, [event]);
    }

    stream() {
        const stream = new Stream(new FromStore(this));

        // 불필요한 스트림이 이벤트 에미터에 계속 남아있을 수 있습니다.
        // 이벤트리스너를 나중에 등록할 수도 있기 때문에 ES5에서는 불필요한 여부를 판단하기 어렵습니다.
        // (ES6에서는 weak 맵을 사용해서 불필요한 여부를 판단할 수 있습니다)
        // 따로 cleanup 메소드를 제공할 지 고민해봐야 할 듯.
        this.on(() => stream.operateNext());

        return new Builder([stream]);
    }
};

