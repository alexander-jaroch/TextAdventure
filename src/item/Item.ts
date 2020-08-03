/// <reference path="../story/Story.ts" />

namespace TextAdventure {
    export interface ItemSaveData {
        type: string;
        id: string;
    }

    export interface ItemData {
        type: string;
        id: string;
        name: string;
        story: StoryData;
    }

    export class Item {
        public readonly id: string;
        public name: string;
        public story: StoryData;

        public constructor(_id: string, _name: string, _story: StoryData) {
            this.id = _id;
            this.name = _name;
            if (_story)
                this.story = _story;
        }

        public static init(_itemData: ItemData, _gridData: GridData): Item {
            return new Item(_itemData.id, _itemData.name, _itemData.story);
        }

        public static load(_itemSaveData: ItemSaveData, _gridData: GridData): Item {
            const itemData: ItemData = _gridData.items.find(x => x.id === _itemSaveData.id);
            return new Item(itemData.id, itemData.name, itemData.story);
        }

        public save(): ItemSaveData {
            return {
                type: typeof this,
                id: this.id
            };
        }

        public stringify(): string {
            return this.name;
        }
    }
}