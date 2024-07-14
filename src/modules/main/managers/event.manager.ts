import { EventEmitter } from "events"
import { Events } from "../types/events.js";
import { Logger } from "../../../core/utils/logger.js";

export default class EventManager {

    private static _emitter = new EventEmitter();
    private static logger = new Logger("EventManager");

    public static emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>) {
        return this._emitter.emit(event, ...args);
    }

    public static on<T extends keyof Events>(event: T, listener: Events[T]) {
        return this._emitter.on(event, listener);
    }

    public static once<T extends keyof Events>(event: T, listener: Events[T]) {
        return this._emitter.once(event, listener);
    }

    public static off<T extends keyof Events>(event: T, listener: Events[T]) {
        return this._emitter.off(event, listener);
    }

    public static removeAllListeners<T extends keyof Events>(event: T) {
        return this._emitter.removeAllListeners(event);
    }

    public static listenerCount<T extends keyof Events>(event: T) {
        return this._emitter.listenerCount(event);
    }

    public static listeners<T extends keyof Events>(event: T) {
        return this._emitter.listeners(event);
    }

    public static eventNames() {
        return this._emitter.eventNames();
    }

    public static getMaxListeners() {
        return this._emitter.getMaxListeners();
    }

    public static setMaxListeners(n: number) {
        return this._emitter.setMaxListeners(n);
    }

    public static rawListeners<T extends keyof Events>(event: T) {
        return this._emitter.rawListeners(event);
    }

    public static prependListener<T extends keyof Events>(event: T, listener: Events[T]) {
        return this._emitter.prependListener(event, listener);
    }

    public static prependOnceListener<T extends keyof Events>(event: T, listener: Events[T]) {
        return this._emitter.prependOnceListener(event, listener);
    }
}
