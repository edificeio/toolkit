/// <reference types="core-js" />
import { Eventer } from './eventer';
export declare class Provider<T> {
    path: string;
    private className;
    private _data;
    eventer: Eventer;
    isSynced: boolean;
    syncing: boolean;
    constructor(path: string, className: Function);
    data(): Promise<T[]>;
    private syncDone();
    private sync();
    refresh(): Promise<void>;
    push(data: T): void;
    remove(data: T): void;
}
