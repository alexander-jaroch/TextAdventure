namespace TextAdventure {
    export type Resolve<T> = (_result: T) => void;
    export type Executor<T> = (_resolve: Resolve<T>) => void;
    export type EventListener = (_event: Event) => void;
    export type Array3D<T> = Array<Array<Array<T>>>;
}