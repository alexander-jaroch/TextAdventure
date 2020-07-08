/// <reference path="ConsoleUserInterface.ts" />
/// <reference path="../Types.ts" />

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
            this.userInterface.appendToOutput(_text);
        }

        public error(..._text: Array<string>): void {
            this.userInterface.appendToOutput(_text, "error");
        }

        public exit(): void {
            this.userInterface.lockInput();
            this.userInterface.setInput("Text Adventure has been quit.");
        }
    }
}