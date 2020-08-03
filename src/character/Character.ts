/// <reference path="../item/CharacterInventory.ts" />
/// <reference path="../stat/Effect.ts" />
/// <reference path="../stat/StatList.ts" />
/// <reference path="../story/Story.ts" />

namespace TextAdventure {
    export interface CharacterSaveData {
        type: string;
        id: string;
        stats: StatList;
        events: CharacterEventList<GameEventSaveData>;
        effects: Array<EffectSaveData>;
        relation: number;
        inventory: CharacterInventorySaveData;
    }

    export interface CharacterData {
        type: string;

        id: string;
        name: string;
        story: CharacterStory;

        stats: StatList;
        events: CharacterEventList<string>;
        effects: Array<string>;
        relation: number;
        equipment: Array<string>;
        inventory: Array<string>;
        inventorySize: number;
    }

    export class Character {
        public readonly id: string;
        public name: string;
        public story: CharacterStory;

        public stats: StatList;
        public events: CharacterEventList<GameEvent<Cell>>;
        public effects: Array<Effect>;
        public relation: number;
        public inventory: CharacterInventory;
        public cell: Cell;

        public constructor(_id: string, _name: string, _story: CharacterStory) {
            this.id = _id;
            this.name = _name;
            this.story = _story;

            this.stats = new StatList();
            this.effects = new Array();
            this.relation = 0;
            this.inventory = new CharacterInventory(0);
        }

        public static init(_characterData: CharacterData, _gridData: GridData, _cell: Cell): Character {
            const character: Character = new Character(
                _characterData.id,
                _characterData.name,
                _characterData.story
            );
            character.stats = _characterData.stats;
            character.events = GameEventParser.parseGameEvents(_characterData.events, _gridData) as CharacterEventList<GameEvent<Cell>>;
            const effectData: Array<EffectData> = _gridData.effects.filter(x => _characterData.effects.includes(x.id));
            character.effects = effectData.map(x => Effect.init(x, _gridData));
            character.relation = _characterData.relation;
            const items: Array<ItemData> = _gridData.items.filter(x => _characterData.inventory.includes(x.id));
            const equipment: Array<ItemData> = _gridData.items.filter(x => _characterData.equipment.includes(x.id));
            character.inventory = CharacterInventory.initCharacterInventory(items, equipment, _gridData, _characterData.inventorySize);
            character.cell = _cell;
            return character;
        }

        public static load(_characterSaveData: CharacterSaveData, _gridData: GridData, _cell: Cell): Character {
            const characterData: CharacterData = _gridData.characters.find(x => x.id === _characterSaveData.id);
            const character: Character = new Character(
                characterData.id,
                characterData.name,
                characterData.story
            );
            character.stats = _characterSaveData.stats;
            character.events = GameEventParser.parseGameEvents(characterData.events, _gridData, _characterSaveData.events) as CharacterEventList<GameEvent<Cell>>;
            character.effects = _characterSaveData.effects.map(x => Effect.load(x, _gridData));
            character.relation = _characterSaveData.relation;
            character.inventory = CharacterInventory.load(_characterSaveData.inventory, _gridData);
            character.cell = _cell;
            return character;
        }

        public save(): CharacterSaveData {
            return {
                type: typeof this,
                id: this.id,
                stats: this.stats,
                events: GameEventParser.saveGameEvents(this.events) as CharacterEventList<GameEventSaveData>,
                effects: this.effects.map(x => x.save()),
                relation: this.relation,
                inventory: this.inventory.save()
            };
        }

        public getDirections(_locked: boolean = false): Array<Pair<string, Cell>> {
            const routes: Array<Pair<string, Cell>> = new Array();
            for (const dir in this.cell.neighbors)
                if (this.cell.neighbors[dir] && (_locked && !this.cell.neighbors[dir].accessible || !_locked && this.cell.neighbors[dir].accessible))
                    routes.push(new Pair(dir, this.cell.neighbors[dir]));
            return routes;
        }

        public canGo(_dir: string): boolean {
            return ;
        }
    }
}