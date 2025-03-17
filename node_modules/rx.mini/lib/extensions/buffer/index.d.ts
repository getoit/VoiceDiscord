import { Event } from "../../core";
export declare function Buffer<T extends any[]>(length: number, event: Event<T>): {
    subscribe: (execute: (...args: T) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => {
        unSubscribe: () => void;
        disposer: (disposer: import("../../core").EventDisposer) => void;
    };
    asPromise: (timeLimit?: number | undefined) => Promise<T>;
    once: (execute: (...args: T) => void, complete?: (() => void) | undefined, error?: ((e: any) => void) | undefined) => void;
};
