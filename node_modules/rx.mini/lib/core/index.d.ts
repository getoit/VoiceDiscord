declare type EventExecute<T extends any[]> = (...args: T) => void;
declare type PromiseEventExecute<T extends any[]> = (...args: T) => Promise<void>;
declare type EventComplete = () => void;
declare type EventError = (e: any) => void;
export declare class Event<T extends any[]> {
    private event;
    ended: boolean;
    onended?: () => void;
    onerror: (e: any) => void;
    execute: (...args: T) => void;
    complete: () => void;
    error: (e: any) => void;
    allUnsubscribe: () => void;
    subscribe: (execute: EventExecute<T>, complete?: EventComplete, error?: EventError) => {
        unSubscribe: () => void;
        disposer: (disposer: EventDisposer) => void;
    };
    queuingSubscribe: (execute: PromiseEventExecute<T>, complete?: EventComplete, error?: EventError) => {
        unSubscribe: () => void;
        disposer: (disposer: EventDisposer) => void;
    };
    once: (execute: EventExecute<T>, complete?: EventComplete, error?: EventError) => void;
    watch: (cb: (...args: T) => boolean, timeLimit?: number) => Promise<T>;
    asPromise: (timeLimit?: number) => Promise<T>;
    get returnTrigger(): {
        execute: (...args: T) => void;
        error: (e: any) => void;
        complete: () => void;
    };
    get returnListener(): {
        subscribe: (execute: EventExecute<T>, complete?: EventComplete | undefined, error?: EventError | undefined) => {
            unSubscribe: () => void;
            disposer: (disposer: EventDisposer) => void;
        };
        once: (execute: EventExecute<T>, complete?: EventComplete | undefined, error?: EventError | undefined) => void;
        asPromise: (timeLimit?: number | undefined) => Promise<T>;
    };
    get length(): number;
}
export declare class EventDisposer {
    private _disposer;
    push(disposer: () => void): void;
    dispose(): void;
}
export {};
