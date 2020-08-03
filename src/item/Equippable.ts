/// <reference path="../item/Slot.ts" />
/// <reference path="../stat/StatList.ts" />
/// <reference path="../story/Story.ts" />
/// <reference path="Item.ts" />

namespace TextAdventure {
    export interface EquippableSaveData extends ItemSaveData {
        stats: StatList;
    }

    export interface EquippableData extends ItemData {
        slots: Array<string>;
        stats: StatList;
    }

    export class Equippable extends Item {
        public stats: StatList;
        public slots: Array<Slot>;

        public constructor(_id: string, _name: string, _story: ItemStory, _slots: Array<Slot>) {
            super(_id, _name, _story);
            this.slots = _slots;
            this.stats = new StatList();
        }

        public static init(_equippableData: EquippableData, _gridData: GridData): Equippable {
            const equippable: Equippable = new Equippable(
                _equippableData.id,
                _equippableData.name,
                _equippableData.story as ItemStory,
                SlotParser.parse(_equippableData.slots)
            );
            equippable.stats = _equippableData.stats;
            return equippable;
        }

        public static load(_itemSaveData: EquippableSaveData, _gridData: GridData): Equippable {
            const equippableData: EquippableData = _gridData.items.find(x => x.id === _itemSaveData.id) as EquippableData;
            const equippable: Equippable = new Equippable(
                equippableData.id,
                equippableData.name,
                equippableData.story as ItemStory,
                SlotParser.parse(equippableData.slots)
            );
            equippable.stats = _itemSaveData.stats;
            return equippable;
        }

        public save(): EquippableSaveData {
            return {
                type: typeof this,
                id: this.id,
                stats: this.stats
            };
        }
    }
}