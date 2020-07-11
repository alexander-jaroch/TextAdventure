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
var TextAdventure;
(function (TextAdventure) {
    class FileLoader {
        constructor(_directory = "files/", _paths = null) {
            this.directory = _directory;
            if (_paths)
                this.paths = _paths;
            else
                this.paths = {
                    cells: { dir: "cells/", file: "_cells.json" },
                    characters: { dir: "characters/", file: "_characters.json" },
                    effects: { dir: "effects/", file: "_effects.json" },
                    events: { dir: "events/", file: "_events.json" },
                    items: { dir: "items/", file: "_items.json" }
                };
        }
        async load() {
            const cells = new Array();
            const characters = new Array();
            const effects = new Array();
            const events = new Array();
            const items = new Array();
            const errors = new Array();
            for (const path in this.paths) {
                const completePath = this.directory + this.paths[path].dir;
                let pathDetail = this.paths[path].file;
                try {
                    const response = await fetch(completePath + pathDetail);
                    const json = await response.json();
                    for (const subPath of json) {
                        pathDetail = subPath;
                        const subResponse = await fetch(completePath + subPath);
                        switch (path) {
                            case "cells":
                                const cellData = await subResponse.json();
                                cells.push(cellData);
                                break;
                            case "characters":
                                const characterData = await subResponse.json();
                                characters.push(characterData);
                                break;
                            case "effects":
                                const effectData = await subResponse.json();
                                effects.push(effectData);
                                break;
                            case "events":
                                const eventData = await subResponse.json();
                                events.push(eventData);
                                break;
                            case "items":
                                const itemData = await subResponse.json();
                                switch (itemData.type) {
                                    case "Consumable":
                                        items.push(itemData); // Cast here
                                        break;
                                    case "Equippable":
                                        items.push(itemData); // Cast here
                                        break;
                                    case "Prop":
                                        items.push(itemData); // Cast here
                                }
                        }
                    }
                }
                catch (e) {
                    errors.push(path + " " + completePath + pathDetail);
                }
            }
            return {
                cells: cells,
                characters: characters,
                effects: effects,
                events: events,
                items: items
            };
        }
    }
    TextAdventure.FileLoader = FileLoader;
})(TextAdventure || (TextAdventure = {}));
/// <reference path="classes/userInterface/Console.ts" />
/// <reference path="classes/FileLoader.ts" />
var TextAdventure;
/// <reference path="classes/userInterface/Console.ts" />
/// <reference path="classes/FileLoader.ts" />
(function (TextAdventure) {
    async function main() {
        const loader = new TextAdventure.FileLoader();
        window.console.log(await loader.load());
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