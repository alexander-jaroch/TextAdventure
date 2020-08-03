namespace TextAdventure {
    export class GameEventList<T> {
        [key: string]: Array<T>;
    }

    export class CellEventList<T> extends GameEventList<T> {
        public onLeave: Array<T>;
        public onUseItem: Array<T>;
    }

    export class CharacterEventList<T> extends GameEventList<T> {
        public onDeath: Array<T>;
    }
}