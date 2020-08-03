namespace TextAdventure {
    export type Executor<T> = (_resolve: Resolve<T>) => void;
}