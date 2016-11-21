export declare class Eventer {
    private events;
    constructor();
    trigger(eventName: string, data?: any): void;
    on(eventName: string, cb: (data?: any) => void): void;
    off(eventName: string, cb?: (data?: any) => void): void;
    once(eventName: string, cb: (data?: any) => void): void;
}
