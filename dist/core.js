"use strict";
var TextVenture;
(function (TextVenture) {
    class Character {
    }
    TextVenture.Character = Character;
})(TextVenture || (TextVenture = {}));
var TextVenture;
(function (TextVenture) {
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
        appendToOutput(_text) {
            const textNode = new Text(_text.join(" "));
            const line = this.document.createElement("div");
            line.appendChild(textNode);
            this.output.appendChild(line);
        }
        addInputEventListener(_eventListener) {
            this.input.addEventListener("keypress", _eventListener);
        }
        removeInputEventListener(_eventListener) {
            this.input.removeEventListener("keypress", _eventListener);
        }
        createOutput() {
            this.output = this.document.createElement("div");
            this.document.body.appendChild(this.output);
        }
        createInput() {
            const wrapper = this.document.createElement("div");
            wrapper.id = "input__wrapper";
            this.input = this.document.createElement("input");
            this.input.type = "text";
            wrapper.appendChild(this.input);
            this.document.body.appendChild(wrapper);
        }
    }
    TextVenture.ConsoleUserInterface = ConsoleUserInterface;
})(TextVenture || (TextVenture = {}));
/// <reference path="ConsoleUserInterface.ts" />
var TextVenture;
/// <reference path="ConsoleUserInterface.ts" />
(function (TextVenture) {
    class Console {
        constructor(_document) {
            this.userInterface = new TextVenture.ConsoleUserInterface(_document);
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
    }
    TextVenture.Console = Console;
})(TextVenture || (TextVenture = {}));
var TextVenture;
(function (TextVenture) {
    class Item {
    }
    TextVenture.Item = Item;
})(TextVenture || (TextVenture = {}));
/// <reference path="Console.ts" />
var TextVenture;
/// <reference path="Console.ts" />
(function (TextVenture) {
    async function main() {
        const console = new TextVenture.Console(document);
        const input = await console.getInput();
        console.log("> ", input);
    }
    main();
})(TextVenture || (TextVenture = {}));
var TextVenture;
(function (TextVenture) {
    class Tile {
    }
    TextVenture.Tile = Tile;
})(TextVenture || (TextVenture = {}));
//# sourceMappingURL=core.js.map