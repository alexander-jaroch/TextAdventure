"use strict";
var TextAdventure;
(function (TextAdventure) {
    class Cell {
    }
    TextAdventure.Cell = Cell;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Character {
    }
    TextAdventure.Character = Character;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
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
    TextAdventure.ConsoleUserInterface = ConsoleUserInterface;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="ConsoleUserInterface.ts" />
var TextAdventure;
/// <reference path="ConsoleUserInterface.ts" />
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
        exit() {
            this.userInterface.lockInput();
            this.userInterface.setInput("Text Adventure has been quit.");
        }
    }
    TextAdventure.Console = Console;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Vector2 {
    }
    TextAdventure.Vector2 = Vector2;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="Cell.ts" />
/// <reference path="Vector2.ts" />
var TextAdventure;
/// <reference path="Cell.ts" />
/// <reference path="Vector2.ts" />
(function (TextAdventure) {
    class Grid {
        constructor() {
            this.cells = new Array();
        }
        loadGrid(_json) {
            const gridData = JSON.parse(_json);
            for (let y; y < gridData.size.y; y++) {
                for (let x; x < gridData.size.x; x++) {
                    const cellData = gridData.cells[y][x];
                    // TO DO create objects of subclasses from Cell
                    console.log(cellData); // Placeholder
                }
            }
        }
    }
    TextAdventure.Grid = Grid;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Item {
    }
    TextAdventure.Item = Item;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="Console.ts" />
var TextAdventure;
/// <reference path="Console.ts" />
(function (TextAdventure) {
    async function main() {
        const console = new TextAdventure.Console(document);
        const rewrites = await (await fetch("Rewrites.json")).json();
        let input;
        do {
            input = await console.getInput();
            console.log("> ", input);
        } while (!rewrites.exit.includes(input));
        console.exit();
    }
    main();
})(TextAdventure || (TextAdventure = {}));
//# sourceMappingURL=core.js.map