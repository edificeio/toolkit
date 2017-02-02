export interface AutosaveElement {
    model: any;
    path?: string;
    method?: string;
    _backup?: string;
    fn?: () => void;
}
export declare class Autosave {
    static watch(path: string | (() => void), model: any, method?: string): void;
    static unwatch(model: any): void;
    static unwatchAll(): void;
}
