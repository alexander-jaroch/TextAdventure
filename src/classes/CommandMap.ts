namespace TextAdventure {
    export class CommandMap {
        public static exit(_input: string): boolean {
            return /exit|quit|q/.test(_input);
        }
        public static east(_input: string): boolean {
            return /east|go east|e/.test(_input);
        }
        public static north(_input: string): boolean {
            return /north|go north|n/.test(_input);
        }
        public static west(_input: string): boolean {
            return /west|go west|w/.test(_input);
        }
        public static south(_input: string): boolean {
            return /south|go south|s/.test(_input);
        }
    }
}