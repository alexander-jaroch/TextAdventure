"use strict";
var TextAdventure;
(function (TextAdventure) {
    class Item {
        constructor(_id, _name, _story) {
            this.id = _id;
            this.name = _name;
            if (_story)
                this.story = _story;
        }
        static init(_itemData, _gridData) {
            return new Item(_itemData.id, _itemData.name, _itemData.story);
        }
        static load(_itemSaveData, _gridData) {
            const itemData = _gridData.items.find(x => x.id === _itemSaveData.id);
            return new Item(itemData.id, itemData.name, itemData.story);
        }
        save() {
            return {
                type: typeof this,
                id: this.id
            };
        }
        stringify() {
            return this.name;
        }
    }
    TextAdventure.Item = Item;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class InventorySaveData {
    }
    TextAdventure.InventorySaveData = InventorySaveData;
    class Inventory {
        constructor() {
            this.items = new Array();
        }
        static init(_itemData, _gridData) {
            const inventory = new Inventory();
            for (const item of _itemData) {
                switch (item.type) {
                    case "Equippable":
                        inventory.addItem(TextAdventure.Equippable.init(item, _gridData));
                        break;
                    case "Consumable":
                        inventory.addItem(TextAdventure.Consumable.init(item, _gridData));
                        break;
                    case "Prop":
                        inventory.addItem(TextAdventure.Item.init(item, _gridData));
                }
            }
            return inventory;
        }
        static load(_inventorySaveData, _gridData) {
            const inventory = new Inventory();
            for (const item of _inventorySaveData.items) {
                switch (item.type) {
                    case "Equippable":
                        inventory.addItem(TextAdventure.Equippable.load(item, _gridData));
                        break;
                    case "Consumable":
                        inventory.addItem(TextAdventure.Consumable.load(item, _gridData));
                        break;
                    case "Prop":
                        inventory.addItem(TextAdventure.Item.load(item, _gridData));
                }
            }
            return inventory;
        }
        get used() {
            return this.items.length;
        }
        save() {
            return {
                items: this.items.map(x => this.subSave(x))
            };
        }
        stringify() {
            return this.items.map(x => x.stringify()).join(", ");
        }
        addItem(_add) {
            this.items.push(_add);
        }
        getItem(_id) {
            return this.items.find(x => x.id === _id);
        }
        removeItem(_remove) {
            const changedItems = new Array();
            for (const item of this.items)
                if (item !== _remove)
                    changedItems.push(item);
            this.items = changedItems;
        }
        hasItem(_id) {
            for (const item of this.items)
                if (item.id === _id)
                    return true;
            return false;
        }
        subSave(_item) {
            if (typeof _item === "Equippable")
                return _item.save();
            else
                return _item.save();
        }
    }
    TextAdventure.Inventory = Inventory;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    let Slot;
    (function (Slot) {
        Slot[Slot["Primary"] = 0] = "Primary";
        Slot[Slot["Secondary"] = 1] = "Secondary";
        Slot[Slot["Head"] = 2] = "Head";
        Slot[Slot["Body"] = 3] = "Body";
        Slot[Slot["Inventory"] = 4] = "Inventory";
    })(Slot = TextAdventure.Slot || (TextAdventure.Slot = {}));
    class SlotParser {
        static parse(_slots) {
            const slotMap = {
                Primary: Slot.Primary,
                Secondary: Slot.Secondary,
                Head: Slot.Head,
                Body: Slot.Body
            };
            return _slots.map(x => slotMap[x]);
        }
    }
    TextAdventure.SlotParser = SlotParser;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class CharacterInventorySaveData extends TextAdventure.InventorySaveData {
    }
    TextAdventure.CharacterInventorySaveData = CharacterInventorySaveData;
    class CharacterInventory extends TextAdventure.Inventory {
        constructor(_size) {
            super();
            this.equipment = new Array(TextAdventure.Slot.Inventory + 1);
            this.size = _size;
        }
        static initCharacterInventory(_itemData, _equippableData, _gridData, _size) {
            const inventory = new CharacterInventory(_size);
            for (const equipment of _equippableData) {
                const equippable = TextAdventure.Equippable.init(equipment, _gridData);
                for (const slot of equippable.slots) {
                    inventory.equipment[slot] = equippable;
                }
            }
            for (const item of _itemData) {
                switch (item.type) {
                    case "Equippable":
                        inventory.addItem(TextAdventure.Equippable.init(item, _gridData));
                        break;
                    case "Consumable":
                        inventory.addItem(TextAdventure.Consumable.init(item, _gridData));
                        break;
                    case "Prop":
                        inventory.addItem(TextAdventure.Item.init(item, _gridData));
                }
            }
            return inventory;
        }
        static load(_inventorySaveData, _gridData) {
            const inventory = new CharacterInventory(_inventorySaveData.size);
            for (const equipment of _inventorySaveData.equipment) {
                if (equipment) {
                    const equippable = TextAdventure.Equippable.load(equipment, _gridData);
                    for (const slot of equippable.slots) {
                        inventory.equipment[slot] = equippable;
                    }
                }
            }
            for (const item of _inventorySaveData.items) {
                switch (item.type) {
                    case "Equippable":
                        inventory.addItem(TextAdventure.Equippable.load(item, _gridData));
                        break;
                    case "Consumable":
                        inventory.addItem(TextAdventure.Consumable.load(item, _gridData));
                        break;
                    case "Prop":
                        inventory.addItem(TextAdventure.Item.load(item, _gridData));
                }
            }
            return inventory;
        }
        get free() {
            return this.size - this.used;
        }
        save() {
            return {
                items: this.items.map(x => this.subSave(x)),
                equipment: this.equipment.map(x => x.save()),
                size: this.size
            };
        }
        stringify() {
            return this.equipment.map(x => x.stringify()).filter(x => x !== "").join(", ") + " | " + super.stringify();
        }
        addItem(_add) {
            if (this.free === 0)
                return false;
            super.addItem(_add);
            return true;
        }
        unequip(_unequip) {
            if (this.free === 0)
                return false;
            if (_unequip && this.equipment.includes(_unequip)) {
                this.addItem(_unequip);
                for (let i = 0; i < this.equipment.length; i++)
                    if (this.equipment[i] === _unequip)
                        delete this.equipment[i];
            }
            return true;
        }
        equip(_equip) {
            const occupyingItems = this.getOccupyingItems(_equip);
            if (this.free < occupyingItems.length - 1)
                return false;
            if (this.items.includes(_equip)) {
                this.removeItem(_equip);
                for (const item of occupyingItems)
                    this.unequip(item);
                for (const slot of _equip.slots)
                    this.equipment[slot] = _equip;
            }
            return true;
        }
        getOccupyingItems(_equip) {
            const occupyingItems = new Array();
            for (const slot of _equip.slots)
                if (!occupyingItems.includes(this.equipment[slot]))
                    occupyingItems.push(this.equipment[slot]);
            return occupyingItems;
        }
    }
    TextAdventure.CharacterInventory = CharacterInventory;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class StatList {
    }
    TextAdventure.StatList = StatList;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Effect {
        constructor(_id, _name, _story) {
            this.id = _id;
            this.name = _name;
            this.story = _story;
            this.stats = new TextAdventure.StatList();
            this.duration = 0;
            this.next = new Array();
        }
        static init(_effectData, _gridData) {
            const effect = new Effect(_effectData.id, _effectData.name, _effectData.story);
            const nextData = _gridData.effects.filter(x => _effectData.next.includes(x.id));
            effect.stats = _effectData.stats;
            effect.duration = _effectData.duration;
            effect.next = nextData.map(x => this.init(x, _gridData));
            return effect;
        }
        static load(_effectSaveData, _gridData) {
            const effectData = _gridData.effects.find(x => x.id === _effectSaveData.id);
            const effect = Effect.init(effectData, _gridData);
            effect.duration = _effectSaveData.duration;
            return effect;
        }
        save() {
            return {
                id: this.id,
                duration: this.duration
            };
        }
    }
    TextAdventure.Effect = Effect;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Character {
        constructor(_id, _name, _story) {
            this.id = _id;
            this.name = _name;
            this.story = _story;
            this.stats = new TextAdventure.StatList();
            this.effects = new Array();
            this.relation = 0;
            this.inventory = new TextAdventure.CharacterInventory(0);
        }
        static init(_characterData, _gridData, _cell) {
            const character = new Character(_characterData.id, _characterData.name, _characterData.story);
            character.stats = _characterData.stats;
            character.events = TextAdventure.GameEventParser.parseGameEvents(_characterData.events, _gridData);
            const effectData = _gridData.effects.filter(x => _characterData.effects.includes(x.id));
            character.effects = effectData.map(x => TextAdventure.Effect.init(x, _gridData));
            character.relation = _characterData.relation;
            const items = _gridData.items.filter(x => _characterData.inventory.includes(x.id));
            const equipment = _gridData.items.filter(x => _characterData.equipment.includes(x.id));
            character.inventory = TextAdventure.CharacterInventory.initCharacterInventory(items, equipment, _gridData, _characterData.inventorySize);
            character.cell = _cell;
            return character;
        }
        static load(_characterSaveData, _gridData, _cell) {
            const characterData = _gridData.characters.find(x => x.id === _characterSaveData.id);
            const character = new Character(characterData.id, characterData.name, characterData.story);
            character.stats = _characterSaveData.stats;
            character.events = TextAdventure.GameEventParser.parseGameEvents(characterData.events, _gridData, _characterSaveData.events);
            character.effects = _characterSaveData.effects.map(x => TextAdventure.Effect.load(x, _gridData));
            character.relation = _characterSaveData.relation;
            character.inventory = TextAdventure.CharacterInventory.load(_characterSaveData.inventory, _gridData);
            character.cell = _cell;
            return character;
        }
        save() {
            return {
                type: typeof this,
                id: this.id,
                stats: this.stats,
                events: TextAdventure.GameEventParser.saveGameEvents(this.events),
                effects: this.effects.map(x => x.save()),
                relation: this.relation,
                inventory: this.inventory.save()
            };
        }
        getDirections(_locked = false) {
            const routes = new Array();
            for (const dir in this.cell.neighbors)
                if (this.cell.neighbors[dir] && (_locked && !this.cell.neighbors[dir].accessible || !_locked && this.cell.neighbors[dir].accessible))
                    routes.push(new TextAdventure.Pair(dir, this.cell.neighbors[dir]));
            return routes;
        }
        canGo(_dir) {
            return;
        }
    }
    TextAdventure.Character = Character;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class GameEvent {
        constructor(_id, _story, _active) {
            this.id = _id;
            this.story = _story;
            this.active = _active;
        }
        save() {
            return {
                id: this.id,
                active: this.active
            };
        }
    }
    TextAdventure.GameEvent = GameEvent;
    class GameEventParser {
        static saveGameEvents(_eventList) {
            let saveData = new TextAdventure.GameEventList();
            for (const listener in _eventList)
                saveData[listener] = _eventList[listener].map(x => { return { id: x.id, active: x.active }; });
            return saveData;
        }
        static parseGameEvents(_eventList, _gridData, _eventSaveData) {
            const eventList = new TextAdventure.CharacterEventList();
            for (const listener in _eventList) {
                const eventData = _gridData.events.filter(x => _eventList[listener].includes(x.id));
                if (_eventSaveData)
                    eventList[listener] = eventData.map(x => this.conditionalParse(x, _eventSaveData[listener]));
                else
                    eventList[listener] = eventData.map(x => this.conditionalParse(x));
            }
            return eventList;
        }
        static conditionalParse(_eventData, _eventSaveData) {
            let event;
            let temp;
            if (_eventSaveData)
                temp = _eventSaveData.find(x => x.id === _eventData.id);
            switch (_eventData.action.toLowerCase()) {
                case "lock":
                    event = new TextAdventure.LockAction(_eventData.id, _eventData.story, temp ? temp.active : true);
                    break;
                case "unlock":
                    event = new TextAdventure.UnlockAction(_eventData.id, _eventData.story, temp ? temp.active : true, _eventData.item);
                    break;
            }
            return event;
        }
    }
    TextAdventure.GameEventParser = GameEventParser;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class GameEventList {
    }
    TextAdventure.GameEventList = GameEventList;
    class CellEventList extends GameEventList {
    }
    TextAdventure.CellEventList = CellEventList;
    class CharacterEventList extends GameEventList {
    }
    TextAdventure.CharacterEventList = CharacterEventList;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class NeighborList {
    }
    TextAdventure.NeighborList = NeighborList;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Cell {
        constructor(_id, _name, _story) {
            this.id = _id;
            this.name = _name;
            this.story = _story;
            this.neighbors = new TextAdventure.NeighborList();
            this.accessible = false;
            this.events = new TextAdventure.CellEventList();
            this.inventory = new TextAdventure.Inventory();
            this.characters = new Array();
        }
        *[Symbol.iterator]() {
            for (const dir in this.neighbors)
                if (this.neighbors[dir])
                    yield this.neighbors[dir];
        }
        save() {
            return {
                id: this.id,
                accessible: this.accessible,
                events: TextAdventure.GameEventParser.saveGameEvents(this.events),
                inventory: this.inventory.save(),
                characters: this.characters.map(x => x.save())
            };
        }
        init(_gridData) {
            const cellData = _gridData.cells.find(x => x.id === this.id);
            this.accessible = cellData.accessible;
            this.events = TextAdventure.GameEventParser.parseGameEvents(cellData.events, _gridData);
            const items = _gridData.items.filter(x => cellData.inventory.includes(x.id));
            this.inventory = TextAdventure.Inventory.init(items, _gridData);
            const characterData = _gridData.characters.filter(x => cellData.characters.includes(x.id));
            this.characters = characterData.map(x => TextAdventure.Character.init(x, _gridData, this));
        }
        load(_cellSaveData, _gridData) {
            const cellData = _gridData.cells.find(x => x.id === this.id);
            this.accessible = _cellSaveData.accessible;
            this.events = TextAdventure.GameEventParser.parseGameEvents(cellData.events, _gridData, _cellSaveData.events);
            this.inventory = TextAdventure.Inventory.load(_cellSaveData.inventory, _gridData);
            this.characters = _cellSaveData.characters.map(x => TextAdventure.Character.load(x, _gridData, this));
        }
    }
    TextAdventure.Cell = Cell;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Path {
        constructor(_dir, _file) {
            this.dir = _dir;
            this.file = _file;
        }
    }
    TextAdventure.Path = Path;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class GameFileReader {
        constructor(_directory = "gamefiles/") {
            this.directory = _directory;
            this.paths = [
                new TextAdventure.Path("cells/", "_cells.json"),
                new TextAdventure.Path("characters/", "_characters.json"),
                new TextAdventure.Path("effects/", "_effects.json"),
                new TextAdventure.Path("events/", "_events.json"),
                new TextAdventure.Path("items/", "_items.json")
            ];
        }
        async read() {
            const cells = new Array();
            const characters = new Array();
            const effects = new Array();
            const events = new Array();
            const items = new Array();
            const errors = new Array();
            for (const path of this.paths) {
                const completePath = this.directory + path.dir;
                try {
                    const response = await fetch(completePath + path.file);
                    const json = await response.json();
                    for (const subPath of json) {
                        path.file = subPath;
                        const subResponse = await fetch(completePath + subPath);
                        switch (path.dir) {
                            case "cells/":
                                const cellData = await subResponse.json();
                                cells.push(cellData);
                                break;
                            case "characters/":
                                const characterData = await subResponse.json();
                                characters.push(characterData);
                                break;
                            case "effects/":
                                const effectData = await subResponse.json();
                                effects.push(effectData);
                                break;
                            case "events/":
                                const eventData = await subResponse.json();
                                events.push(eventData);
                                break;
                            case "items/":
                                const itemData = await subResponse.json();
                                items.push(itemData);
                        }
                    }
                }
                catch (e) {
                    errors.push(path + " " + completePath + path.file);
                }
            }
            return new TextAdventure.GridData(cells, characters, effects, events, items);
        }
    }
    TextAdventure.GameFileReader = GameFileReader;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Pair {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
    }
    TextAdventure.Pair = Pair;
    class PairedArray {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        get length() {
            return Math.min(this.x.length, this.y.length);
        }
        *[Symbol.iterator]() {
            for (let i = 0; i < this.length; i++)
                yield new Pair(this.x[i], this.y[i]);
        }
    }
    TextAdventure.PairedArray = PairedArray;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class GridData {
        constructor(_cells, _characters, _effects, _events, _items) {
            this.cells = _cells;
            this.characters = _characters;
            this.effects = _effects;
            this.events = _events;
            this.items = _items;
        }
    }
    TextAdventure.GridData = GridData;
    class Grid {
        constructor() {
            this.cells = new Array();
            this.characters = new Array();
        }
        async init() {
            const reader = new TextAdventure.GameFileReader();
            this.data = await reader.read();
            for (const cellData of this.data.cells) {
                const cell = new TextAdventure.Cell(cellData.id, cellData.name, cellData.story);
                this.cells.push(cell);
            }
            const pairedArray = new TextAdventure.PairedArray(this.data.cells, this.cells);
            for (const source of pairedArray)
                for (const target of pairedArray)
                    for (const direction in target.x.neighbors)
                        if (source.x.id === target.x.neighbors[direction])
                            target.y.neighbors[direction] = source.y;
        }
        newGame() {
            for (const cell of this.cells)
                cell.init(this.data);
            this.populateCharacters();
        }
        save() {
            const cellSaveData = new Array();
            for (const cell of this.cells)
                cellSaveData.push(cell.save());
            return {
                cells: cellSaveData
            };
        }
        load(_gridSaveData) {
            for (const cell of this.cells) {
                const cellSaveData = _gridSaveData.cells.find(x => x.id === cell.id);
                cell.load(cellSaveData, this.data);
            }
            this.populateCharacters();
        }
        populateCharacters() {
            for (const cell of this.cells) {
                for (const character of cell.characters) {
                    if (character.id === "player")
                        this.player = character;
                    else
                        this.characters.push(character);
                }
            }
        }
    }
    TextAdventure.Grid = Grid;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    let GameState;
    (function (GameState) {
        GameState[GameState["Pre"] = 0] = "Pre";
        GameState[GameState["Menu"] = 1] = "Menu";
        GameState[GameState["Loading"] = 2] = "Loading";
        GameState[GameState["Running"] = 3] = "Running";
        GameState[GameState["Saving"] = 4] = "Saving";
        GameState[GameState["Quitting"] = 5] = "Quitting";
    })(GameState = TextAdventure.GameState || (TextAdventure.GameState = {}));
    let Command;
    (function (Command) {
        Command[Command["NewGame"] = 0] = "NewGame";
        Command[Command["Load"] = 1] = "Load";
        Command[Command["Save"] = 2] = "Save";
        Command[Command["Exit"] = 3] = "Exit";
        Command[Command["Eeast"] = 4] = "Eeast";
        Command[Command["North"] = 5] = "North";
        Command[Command["West"] = 6] = "West";
        Command[Command["South"] = 7] = "South";
        Command[Command["Up"] = 8] = "Up";
        Command[Command["Down"] = 9] = "Down";
        Command[Command["Look"] = 10] = "Look";
        Command[Command["LookAt"] = 11] = "LookAt";
        Command[Command["NaC"] = 12] = "NaC";
    })(Command = TextAdventure.Command || (TextAdventure.Command = {}));
    class FullCommand {
        constructor(_regexp, _command) {
            this.regexp = _regexp;
            this.command = _command;
            this.matches = new Array();
        }
        check(_input) {
            this.matches = this.regexp.exec(_input);
            return this.regexp.test(_input);
        }
    }
    class Game {
        constructor() {
            this.state = GameState.Pre;
            this.output = new Array();
            this.commandMap = [
                new FullCommand(/^new game$/, Command.NewGame),
                new FullCommand(/^load$/, Command.Load),
                new FullCommand(/^save$/, Command.Save),
                new FullCommand(/^(exit|quit)$/, Command.Exit),
                new FullCommand(/^(go )?east$/, Command.Eeast),
                new FullCommand(/^(go )?north$/, Command.North),
                new FullCommand(/^(go )?west$/, Command.West),
                new FullCommand(/^(go )?south$/, Command.South),
                new FullCommand(/^(go )?up$/, Command.Down),
                new FullCommand(/^(go )?down$/, Command.Up),
                new FullCommand(/^look( around)?$/, Command.Look),
                new FullCommand(/^look at (.*)/, Command.LookAt)
            ];
        }
        get savedata() {
            return JSON.stringify(this.savegame);
        }
        async init() {
            this.grid = new TextAdventure.Grid();
            this.state = GameState.Pre;
            await this.grid.init();
            this.state = GameState.Menu;
            this.output = [
                "Welcome to this Text Adventure Game!",
                "New Game",
                "Load",
                "Exit"
            ];
        }
        async do(_input) {
            const command = this.getCommand(this.prepare(_input));
            switch (this.state) {
                case GameState.Menu:
                    await this.menu(command);
                    break;
                case GameState.Running:
                    await this.ingame(command);
            }
        }
        async load(_file) {
            if (GameState.Loading) {
                if (_file) {
                    const dataString = await _file.text();
                    const data = JSON.parse(dataString);
                    this.grid.load(data);
                    this.state = GameState.Running;
                    this.output = ["You've loaded a savegame..."];
                }
                else {
                    this.state = GameState.Menu;
                    this.output = ["You've aborted loading a savegame..."];
                }
            }
        }
        async save() {
            if (GameState.Saving) {
                this.savegame = this.grid.save();
                this.state = GameState.Running;
                this.output = ["Game saved..."];
            }
        }
        getDirections(_character, _locked = false) {
            const found = _character.getDirections(_locked);
            return found.map(x => this.replaceCommand(x));
        }
        replaceCommand(_pair) {
            return new TextAdventure.Pair(this.getCommand(_pair.x), _pair.y);
        }
        getCommand(_input) {
            for (const fullCommand of this.commandMap)
                if (fullCommand.check(_input))
                    return fullCommand;
            return new FullCommand(/ /, Command.NaC);
        }
        prepare(_command) {
            return _command.trim().toLowerCase();
        }
        async menu(_fullCommand) {
            switch (_fullCommand.command) {
                case Command.NewGame:
                    await this.new();
                    break;
                case Command.Load:
                    this.state = GameState.Loading;
                    this.output = ["Choose your savegame and press ENTER..."];
                    break;
                case Command.Exit:
                    this.state = GameState.Quitting;
                    this.output = ["quitting game..."];
            }
        }
        async ingame(_fullCommand) {
            switch (_fullCommand.command) {
                case Command.Save:
                    this.state = GameState.Saving;
                    this.output = ["Saving game. Please enter filename..."];
                    break;
                case Command.Look:
                    this.output = this.random(this.grid.player.cell.story.description);
                    const routes = this.getDirections(this.grid.player, false);
                    const locked = this.getDirections(this.grid.player, true);
                    if (routes.length === 0)
                        this.output.push("You have no way to go.");
                    for (const route of routes)
                        this.output.push(`To your ${route.x.matches[0]}, there is ${route.y.name}.`);
                    for (const route of locked)
                        this.output.push(`To your ${route.x.matches[0]}, there is ${route.y.name}. ${this.random(route.y.story.inaccessible).join(". ")}`);
                    for (const character of this.grid.player.cell.characters)
                        this.output.push(`There is ${character.name}.`);
                    for (const item of this.grid.player.cell.inventory.items)
                        this.output.push(`There is ${item.name}.`);
                    break;
                case Command.LookAt:
                    const thing = this.prepare(_fullCommand.matches[1]);
                    let found = false;
                    for (const cell of this.grid.player.cell) {
                        if (cell.name.toLowerCase().includes(thing)) {
                            if (cell.accessible)
                                this.output = this.random(cell.story.description);
                            else
                                this.output = this.random(cell.story.inaccessible);
                            found = true;
                            break;
                        }
                    }
                    for (const item of this.grid.player.cell.inventory.items) {
                        if (item.name.toLowerCase().includes(thing)) {
                            this.output = this.random(item.story.description);
                            found = true;
                            break;
                        }
                    }
                    for (const character of this.grid.player.cell.characters) {
                        if (character.name.toLowerCase().includes(thing)) {
                            this.output = this.random(character.story.description);
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        this.output = ["There is nothing like that."];
                    break;
                case Command.Exit:
                    this.state = GameState.Menu;
                    await this.init();
            }
        }
        async new() {
            if (GameState.Menu) {
                this.grid.newGame();
                this.state = GameState.Running;
                this.output = ["You've started a new game..."];
            }
        }
        random(_array) {
            const rand = Math.floor(Math.random() * _array.length);
            return [_array[rand]];
        }
    }
    TextAdventure.Game = Game;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class ConsoleUserInterface {
        constructor(_document) {
            this.document = _document;
            this.createOutput();
            this.createInput();
            this.focus();
        }
        getInput() {
            return this.input.value;
        }
        setInput(_text = "") {
            this.input.value = _text;
            this.focus();
        }
        focus() {
            this.input.focus();
        }
        getFile() {
            return this.file.files[0];
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
        appendAnchor(_href, _text, _download) {
            const anchor = document.createElement("a");
            anchor.href = _href;
            anchor.appendChild(new Text(_text));
            if (_download)
                anchor.download = _download;
            this.output.appendChild(anchor);
        }
        appendFileUpload(_accept) {
            this.file = document.createElement("input");
            this.file.type = "file";
            this.file.accept = _accept;
            this.file.classList.add("file");
            this.output.appendChild(this.file);
            this.file.addEventListener("change", () => { this.focus(); });
        }
        disableFileUpload() {
            this.file.disabled = true;
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
var TextAdventure;
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
            for (const line of _text)
                this.userInterface.appendToOutput([line]);
        }
        error(..._text) {
            this.userInterface.appendToOutput(_text, "error");
        }
        exit() {
            this.userInterface.lockInput();
        }
        download(_data, _filename, _filetype = "application/json") {
            const blob = new Blob([_data], { type: _filetype });
            const url = URL.createObjectURL(blob);
            this.userInterface.appendAnchor(url, `${_filename} (${blob.size} Bytes)`, _filename);
        }
        async upload(_accept = ".json") {
            this.userInterface.appendFileUpload(_accept);
            const inputExecutor = (_resolve) => {
                const inputEventListener = (_event) => {
                    const event = _event;
                    if (event.key === "Enter") {
                        const file = this.userInterface.getFile();
                        this.userInterface.removeInputEventListener(inputEventListener);
                        this.userInterface.disableFileUpload();
                        _resolve(file);
                    }
                };
                this.userInterface.addInputEventListener(inputEventListener);
            };
            return new Promise(inputExecutor);
        }
    }
    TextAdventure.Console = Console;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    async function main() {
        const game = new TextAdventure.Game();
        await game.init();
        const console = new TextAdventure.Console(document);
        let input;
        do {
            console.log(...game.output);
            switch (game.state) {
                case TextAdventure.GameState.Loading:
                    const file = await console.upload();
                    await game.load(file);
                    break;
                case TextAdventure.GameState.Saving:
                    await game.save();
                    input = await console.getInput();
                    console.download(game.savedata, `${input}.json`, "application/json");
                    break;
                default:
                    input = await console.getInput();
                    console.log(`> ${input}`);
                    await game.do(input);
            }
        } while (game.state != TextAdventure.GameState.Quitting);
        console.log(...game.output);
        console.exit();
    }
    main();
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class LockAction extends TextAdventure.GameEvent {
        constructor(_id, _story, _active) {
            super(_id, _story, _active);
        }
        fire(_source) {
            if (this.active && this.target && _source) {
                this.target.accessible = false;
                this.active = false;
                return true;
            }
            return false;
        }
    }
    TextAdventure.LockAction = LockAction;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class UnlockAction extends TextAdventure.GameEvent {
        constructor(_id, _story, _active, _item) {
            super(_id, _story, _active);
            this.item = _item;
        }
        fire(_source) {
            if (this.active && this.target && _source && _source.inventory.hasItem(this.item)) {
                _source.inventory.removeItem(_source.inventory.getItem(this.item));
                this.target.accessible = true;
                this.active = false;
                return true;
            }
            return false;
        }
    }
    TextAdventure.UnlockAction = UnlockAction;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Consumable extends TextAdventure.Item {
        constructor(_id, _name, _story, _effects, _throwable) {
            super(_id, _name, _story);
            this.effects = _effects;
            this.throwable = _throwable;
        }
        static init(_consumableData, _gridData) {
            const effectData = _gridData.effects.filter(x => _consumableData.effects.includes(x.id));
            const consumable = new Consumable(_consumableData.id, _consumableData.name, _consumableData.story, effectData.map(x => TextAdventure.Effect.init(x, _gridData)), _consumableData.throwable);
            return consumable;
        }
        static load(_itemSaveData, _gridData) {
            const consumableData = _gridData.items.find(x => x.id === _itemSaveData.id);
            const effectData = _gridData.effects.filter(x => consumableData.effects.includes(x.id));
            const consumable = new Consumable(consumableData.id, consumableData.name, consumableData.story, effectData.map(x => TextAdventure.Effect.init(x, _gridData)), consumableData.throwable);
            return consumable;
        }
    }
    TextAdventure.Consumable = Consumable;
})(TextAdventure || (TextAdventure = {}));
var TextAdventure;
(function (TextAdventure) {
    class Equippable extends TextAdventure.Item {
        constructor(_id, _name, _story, _slots) {
            super(_id, _name, _story);
            this.slots = _slots;
            this.stats = new TextAdventure.StatList();
        }
        static init(_equippableData, _gridData) {
            const equippable = new Equippable(_equippableData.id, _equippableData.name, _equippableData.story, TextAdventure.SlotParser.parse(_equippableData.slots));
            equippable.stats = _equippableData.stats;
            return equippable;
        }
        static load(_itemSaveData, _gridData) {
            const equippableData = _gridData.items.find(x => x.id === _itemSaveData.id);
            const equippable = new Equippable(equippableData.id, equippableData.name, equippableData.story, TextAdventure.SlotParser.parse(equippableData.slots));
            equippable.stats = _itemSaveData.stats;
            return equippable;
        }
        save() {
            return {
                type: typeof this,
                id: this.id,
                stats: this.stats
            };
        }
    }
    TextAdventure.Equippable = Equippable;
})(TextAdventure || (TextAdventure = {}));
//# sourceMappingURL=core.js.map