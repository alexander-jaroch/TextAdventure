namespace TextAdventure {
    export class NeighborList<T> {
        public up: T;
        public east: T;
        public south: T;
        public west: T;
        public north: T;
        public down: T;

        [key: string]: T;
    }
}