export interface Selectable {
    selected: boolean;
}
export declare class Selection<T extends Selectable> {
    private arr;
    private selectedElements;
    constructor(arr: T[]);
    get all(): T[];
    set all(all: T[]);
    filter(filter: any): T[];
    push(item: T): void;
    addRange(arr: T[]): void;
    get colLength(): number;
    get length(): number;
    forEach(func: (item: any) => void): void;
    selectAll(): void;
    select(filter: (T: any) => boolean): void;
    deselect(filter: (T: any) => boolean): void;
    deselectAll(): void;
    removeSelection(): void;
    updateSelected(): void;
    get selected(): T[];
}
