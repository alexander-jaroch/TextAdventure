namespace TextAdventure {
    export class Path {
        public dir: string;
        public file: string;

        constructor(_dir: string, _file: string) {
            this.dir = _dir;
            this.file = _file;
        }
    }
}