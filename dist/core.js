"use strict";
/// <reference path="EventListener.ts" />
var TextAdventure;
/// <reference path="EventListener.ts" />
(function (TextAdventure) {
    class ConsoleUserInterface {
        constructor(_document) {
            this.document = _document;
            this.createOutput();
            this.createInput();
        }
        getInput() {
            return this.input.value;
        }
        setInput(_text = "") {
            this.input.value = _text;
        }
        lockInput() {
            this.input.disabled = true;
            this.input.classList.add("locked");
        }
        appendToOutput(_text, _class = "") {
            const textNode = new Text(_text.join(" "));
            const line = this.document.createElement("div");
            line.appendChild(textNode);
            if (_class)
                line.classList.add(..._class.split(" "));
            this.output.appendChild(line);
        }
        addInputEventListener(_eventListener) {
            this.input.addEventListener("keypress", _eventListener);
        }
        removeInputEventListener(_eventListener) {
            this.input.removeEventListener("keypress", _eventListener);
        }
        createInput() {
            const wrapper = this.document.createElement("div");
            wrapper.id = "input__wrapper";
            this.input = this.document.createElement("input");
            this.input.type = "text";
            wrapper.appendChild(this.input);
            this.document.body.appendChild(wrapper);
        }
        createOutput() {
            this.output = this.document.createElement("div");
            this.document.body.appendChild(this.output);
        }
    }
    TextAdventure.ConsoleUserInterface = ConsoleUserInterface;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="ConsoleUserInterface.ts" />
/// <reference path="Executor.ts" />
/// <reference path="Resolve.ts" />
var TextAdventure;
/// <reference path="ConsoleUserInterface.ts" />
/// <reference path="Executor.ts" />
/// <reference path="Resolve.ts" />
(function (TextAdventure) {
    class Console {
        constructor(_document) {
            this.userInterface = new TextAdventure.ConsoleUserInterface(_document);
        }
        async getInput() {
            const inputExecutor = (_resolve) => {
                const inputEventListener = (_event) => {
                    const event = _event;
                    if (event.key === "Enter") {
                        const input = this.userInterface.getInput();
                        this.userInterface.removeInputEventListener(inputEventListener);
                        this.userInterface.setInput();
                        _resolve(input);
                    }
                };
                this.userInterface.addInputEventListener(inputEventListener);
            };
            return new Promise(inputExecutor);
        }
        log(..._text) {
            this.userInterface.appendToOutput(_text);
        }
        error(..._text) {
            this.userInterface.appendToOutput(_text, "error");
        }
        exit() {
            this.userInterface.lockInput();
            this.userInterface.setInput("Text Adventure has been quit.");
        }
    }
    TextAdventure.Console = Console;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="classes/userInterface/Console.ts" />
var TextAdventure;
/// <reference path="classes/userInterface/Console.ts" />
(function (TextAdventure) {
    async function main() {
        const console = new TextAdventure.Console(document);
        let input;
        do {
            input = await console.getInput();
            console.log(">", input);
        } while (!/exit|quit|q/.test(input));
        console.exit();
    }
    main();
})(TextAdventure || (TextAdventure = {}));
//# sourceMappingURL=core.js.map