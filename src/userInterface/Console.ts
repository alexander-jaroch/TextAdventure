/// <reference path="ConsoleUserInterface.ts" />
/// <reference path="Executor.ts" />
/// <reference path="Resolve.ts" />

namespace TextAdventure {
    export class Console {
        private userInterface: ConsoleUserInterface;

        public constructor(_document: HTMLDocument) {
            this.userInterface = new ConsoleUserInterface(_document);
        }

        public async getInput(): Promise<string> {
            const inputExecutor: Executor<string> = (_resolve: Resolve<string>) => {
                const inputEventListener: EventListener = (_event: Event) => {
                    const event: KeyboardEvent = _event as KeyboardEvent;
                    if (event.key === "Enter") {
                        const input: string = this.userInterface.getInput();
                        this.userInterface.removeInputEventListener(inputEventListener);
                        this.userInterface.setInput();
                        _resolve(input);
                    }
                };
                this.userInterface.addInputEventListener(inputEventListener);
            };
            return new Promise<string>(inputExecutor);
        }

        public log(..._text: Array<string>): void {
            for (const line of _text)
                this.userInterface.appendToOutput([line]);
        }

        public error(..._text: Array<string>): void {
            this.userInterface.appendToOutput(_text, "error");
        }

        public exit(): void {
            this.userInterface.lockInput();
        }

        public download(_data: string, _filename: string, _filetype: string = "application/json"): void {
            const blob: Blob = new Blob([_data], { type: _filetype });
            const url: string = URL.createObjectURL(blob);
            this.userInterface.appendAnchor(url, `${_filename} (${blob.size} Bytes)`, _filename);
        }

        public async upload(_accept: string = ".json"): Promise<File> {
            this.userInterface.appendFileUpload(_accept);
            const inputExecutor: Executor<File> = (_resolve: Resolve<File>) => {
                const inputEventListener: EventListener = (_event: Event) => {
                    const event: KeyboardEvent = _event as KeyboardEvent;
                    if (event.key === "Enter") {
                        const file: File = this.userInterface.getFile();
                        this.userInterface.removeInputEventListener(inputEventListener);
                        this.userInterface.disableFileUpload();
                        _resolve(file);
                    }
                };
                this.userInterface.addInputEventListener(inputEventListener);
            };
            return new Promise<File>(inputExecutor);
        }
    }
}