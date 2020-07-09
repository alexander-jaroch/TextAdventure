/// <reference path="EventListener.ts" />

namespace TextAdventure {
    export class ConsoleUserInterface {
        private document: HTMLDocument;
        private input: HTMLInputElement;
        private output: HTMLDivElement;

        public constructor(_document: HTMLDocument) {
            this.document = _document;
            this.createOutput();
            this.createInput();
        }

        public getInput(): string {
            return this.input.value;
        }

        public setInput(_text: string = ""): void {
            this.input.value = _text;
        }

        public lockInput(): void {
            this.input.disabled = true;
            this.input.classList.add("locked");
        }

        public appendToOutput(_text: Array<string>, _class: string = ""): void {
            const textNode: Text = new Text(_text.join(" "));
            const line: HTMLDivElement = this.document.createElement("div");
            line.appendChild(textNode);
            if (_class)
                line.classList.add(..._class.split(" "));
            this.output.appendChild(line);
        }

        public addInputEventListener(_eventListener: EventListener): void {
            this.input.addEventListener("keypress", _eventListener);
        }

        public removeInputEventListener(_eventListener: EventListener): void {
            this.input.removeEventListener("keypress", _eventListener);
        }

        private createInput(): void {
            const wrapper: HTMLDivElement = this.document.createElement("div");
            wrapper.id = "input__wrapper";
            this.input = this.document.createElement("input");
            this.input.type = "text";
            wrapper.appendChild(this.input);
            this.document.body.appendChild(wrapper);
        }

        private createOutput(): void {
            this.output = this.document.createElement("div");
            this.document.body.appendChild(this.output);
        }
    }
}