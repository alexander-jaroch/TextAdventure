namespace TextAdventure {
    export class StatList {
        public health: number;
        public energy: number;
        public attack: number;
        public defense: number;
        public evasion: number;

        [key: string]: number;
    }
}