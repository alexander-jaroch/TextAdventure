/// <reference path="../character/Character.ts" />
/// <reference path="../event/GameEvent.ts" />
/// <reference path="../fileReader/GameFileReader.ts" />
/// <reference path="../item/Item.ts" />
/// <reference path="../stat/Effect.ts" />
/// <reference path="Cell.ts" />
/// <reference path="Pair.ts" />


namespace TextAdventure {
    export interface GridSaveData {
        cells: Array<CellSaveData>;
    }

    export class GridData {
        cells: Array<CellData>;
        characters: Array<CharacterData>;
        effects: Array<EffectData>;
        events: Array<GameEventData>;
        items: Array<ItemData>;

        public constructor(_cells: Array<CellData>, _characters: Array<CharacterData>, _effects: Array<EffectData>, _events: Array<GameEventData>, _items: Array<ItemData>) {
            this.cells = _cells;
            this.characters = _characters;
            this.effects = _effects;
            this.events = _events;
            this.items = _items;
        }
    }

    export class Grid {
        public cells: Array<Cell>;
        public characters: Array<Character>;
        public data: GridData;

        public player: Character;

        public constructor() {
            this.cells = new Array();
            this.characters = new Array();
        }

        public async init(): Promise<void> {
            const reader: GameFileReader = new GameFileReader();
            this.data = await reader.read();

            // push cells
            for (const cellData of this.data.cells) {
                const cell: Cell = new Cell(cellData.id, cellData.name, cellData.story);
                this.cells.push(cell);
            }

            const pairedArray: PairedArray<CellData, Cell> = new PairedArray(this.data.cells, this.cells);

            // connect cells
            for (const source of pairedArray)
                for (const target of pairedArray)
                    for (const direction in target.x.neighbors)
                        if (source.x.id === target.x.neighbors[direction])
                            target.y.neighbors[direction] = source.y;
        }

        public newGame(): void {
            for (const cell of this.cells)
                cell.init(this.data);
            this.populateCharacters();
        }

        public save(): GridSaveData {
            const cellSaveData: Array<CellSaveData> = new Array();
            for (const cell of this.cells)
                cellSaveData.push(cell.save());
            return {
                cells: cellSaveData
            };
        }

        public load(_gridSaveData: GridSaveData): void {
            for (const cell of this.cells) {
                const cellSaveData: CellSaveData = _gridSaveData.cells.find(x => x.id === cell.id);
                cell.load(cellSaveData, this.data);
            }
            this.populateCharacters();
        }

        private populateCharacters(): void {
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
}