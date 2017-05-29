export interface Selectable {
    selected: boolean;
}
export declare class Selection<T extends Selectable> {
    private arr;
    private selectedElements;
    constructor(arr: T[]);
    all: T[];
    filter(filter: any): T[];
    push(item: T): void;
    addRange(arr: T[]): void;
    readonly colLength: number;
    readonly length: number;
    forEach(func: (item) => void): void;
    selectAll(): void;
    select(filter: (T) => boolean): void;
    deselect(filter: (T) => boolean): void;
    deselectAll(): void;
    removeSelection(): void;
    updateSelected(): void;
    readonly selected: T[];
}
