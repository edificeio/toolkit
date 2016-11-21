export interface Selectable {
    selected: boolean;
}
export declare class Selection<T extends Selectable> {
    private arr;
    private selectedElements;
    constructor(arr: T[]);
    selectAll(): void;
    select(filter: (T) => boolean): void;
    deselect(filter: (T) => boolean): void;
    deselectAll(): void;
    removeSelection(): void;
    updateSelected(): void;
    readonly selected: T[];
}
