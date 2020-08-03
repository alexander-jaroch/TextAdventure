/// <reference path="../character/Character.ts" />
/// <reference path="../event/GameEventList.ts" />
/// <reference path="../item/Inventory.ts" />
/// <reference path="../story/Story.ts" />
/// <reference path="NeighborList.ts" />

namespace TextAdventure {
    export interface CellSaveData {
        id: string;
        accessible: boolean;
        events: CellEventList<GameEventSaveData>;
        inventory: InventorySaveData;
        characters: Array<CharacterSaveData>;
    }

    export interface CellData {
        id: string;
        name: string;
        story: CellStory;
        neighbors: NeighborList<string>;

        accessible: boolean;

        events: CellEventList<string>;
        inventory: Array<string>;
        characters: Array<string>;
    }

    export class Cell {

        public readonly id: string;
        public name: string;
        public story: CellStory;
        public neighbors: NeighborList<Cell>;

        public accessible: boolean;
        public events: CellEventList<GameEvent<Cell>>;
        public inventory: Inventory;
        public characters: Array<Character>;

        public constructor(_id: string, _name: string, _story: CellStory) {
            this.id = _id;
            this.name = _name;
            this.story = _story;
            this.neighbors = new NeighborList();

            this.accessible = false;

            this.events = new CellEventList();
            this.inventory = new Inventory();
            this.characters = new Array();
        }

        *[Symbol.iterator](): Generator<Cell> {
            for (const dir in this.neighbors)
                if (this.neighbors[dir])
                    yield this.neighbors[dir];
        }

        public save(): CellSaveData {
            return {
                id: this.id,
                accessible: this.accessible,
                events: GameEventParser.saveGameEvents(this.events) as CellEventList<GameEventSaveData>,
                inventory: this.inventory.save(),
                characters: this.characters.map(x => x.save())
            };
        }

        public init(_gridData: GridData): void {
            const cellData: CellData = _gridData.cells.find(x => x.id === this.id);
            this.accessible = cellData.accessible;
            this.events = GameEventParser.parseGameEvents(cellData.events, _gridData) as CellEventList<GameEvent<Cell>>;
            const items: Array<ItemData> = _gridData.items.filter(x => cellData.inventory.includes(x.id));
            this.inventory = Inventory.init(items, _gridData);
            const characterData: Array<CharacterData> = _gridData.characters.filter(x => cellData.characters.includes(x.id));
            this.characters = characterData.map(x => Character.init(x, _gridData, this));
        }

        public load(_cellSaveData: CellSaveData, _gridData: GridData): void {
            const cellData: CellData = _gridData.cells.find(x => x.id === this.id);
            this.accessible = _cellSaveData.accessible;
            this.events = GameEventParser.parseGameEvents(cellData.events, _gridData, _cellSaveData.events) as CellEventList<GameEvent<Cell>>;
            this.inventory = Inventory.load(_cellSaveData.inventory, _gridData);
            this.characters = _cellSaveData.characters.map(x => Character.load(x, _gridData, this));
        }
    }
}