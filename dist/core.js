"use strict";
var TextAdventure;
(function (TextAdventure) {
    class CommandMap {
        static exit(_input) {
            return /exit|quit|q/.test(_input);
        }
        static east(_input) {
            return /east|go east|e/.test(_input);
        }
        static north(_input) {
            return /north|go north|n/.test(_input);
        }
        static west(_input) {
            return /west|go west|w/.test(_input);
        }
        static south(_input) {
            return /south|go south|s/.test(_input);
        }
    }
    TextAdventure.CommandMap = CommandMap;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="../Types.ts" />
var TextAdventure;
/// <reference path="../Types.ts" />
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
/// <reference path="../Types.ts" />
var TextAdventure;
/// <reference path="ConsoleUserInterface.ts" />
/// <reference path="../Types.ts" />
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
/// <reference path="classes/CommandMap.ts" />
/// <reference path="classes/userInterface/Console.ts" />
var TextAdventure;
/// <reference path="classes/CommandMap.ts" />
/// <reference path="classes/userInterface/Console.ts" />
(function (TextAdventure) {
    async function main() {
        const console = new TextAdventure.Console(document);
        let input;
        do {
            input = await console.getInput();
            console.log(">", input);
        } while (!TextAdventure.CommandMap.exit(input));
        console.exit();
    }
    main();
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Vector3D {
        constructor(_x, _y, _z) {
            this.x = _x;
            this.y = _y;
            this.z = _z;
        }
    }
    TextAdventure.Vector3D = Vector3D;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="../cell/CellData.ts" />
var TextAdventure;
/// <reference path="../cell/CellData.ts" />
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
/// <reference path="../Vector3D.ts" />
/// <reference path="../cell/CellData.ts" />
/// <reference path="../cell/Cell.ts" />
/// <reference path="../cell/CellData.ts" />
/// <reference path="./GridData.ts" />
var TextAdventure;
/// <reference path="../cell/Cell.ts" />
/// <reference path="../cell/CellData.ts" />
/// <reference path="./GridData.ts" />
(function (TextAdventure) {
    class Grid {
        constructor() {
            this.cells = new Array();
        }
        loadGrid(_gridData) {
            for (let y; y < _gridData.size.y; y++) {
                for (let x; x < _gridData.size.x; x++) {
                    const cellData = _gridData.cells[y][x];
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
//# sourceMappingURL=core.js.map