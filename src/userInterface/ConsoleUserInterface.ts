/// <reference path="EventListener.ts" />

namespace TextAdventure {
    export class ConsoleUserInterface {
        private document: HTMLDocument;
        private input: HTMLInputElement;
        private output: HTMLDivElement;
        private file: HTMLInputElement;

        public constructor(_document: HTMLDocument) {
            this.document = _document;
            this.createOutput();
            this.createInput();
            this.focus();
        }

        public getInput(): string {
            return this.input.value;
        }

        public setInput(_text: string = ""): void {
            this.input.value = _text;
            this.focus();
        }

        public focus(): void {
            this.input.focus();
        }

        public getFile(): File {
            return this.file.files[0];
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

        public appendAnchor(_href: string, _text: string, _download?: string): void {
            const anchor: HTMLAnchorElement = document.createElement("a");
            anchor.href = _href;
            anchor.appendChild(new Text(_text));
            if (_download)
                anchor.download = _download;
            this.output.appendChild(anchor);
        }

        public appendFileUpload(_accept: string): void {
            this.file = document.createElement("input");
            this.file.type = "file";
            this.file.accept = _accept;
            this.file.classList.add("file");
            this.output.appendChild(this.file);
            this.file.addEventListener("change", () => { this.focus(); });
        }

        public disableFileUpload(): void {
            this.file.disabled = true;
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