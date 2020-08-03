/// <reference path="Item.ts" />

namespace TextAdventure {
    export class InventorySaveData {
        items: Array<ItemSaveData>;
    }

    export class Inventory {
        public items: Array<Item>;

        public constructor() {
            this.items = new Array();
        }

        public static init(_itemData: Array<ItemData>, _gridData: GridData): Inventory {
            const inventory: Inventory = new Inventory();
            for (const item of _itemData) {
                switch (item.type) {
                    case "Equippable":
                        inventory.addItem(Equippable.init(item as EquippableData, _gridData));
                        break;
                    case "Consumable":
                        inventory.addItem(Consumable.init(item as ConsumableData, _gridData));
                        break;
                    case "Prop":
                        inventory.addItem(Item.init(item, _gridData));
                }
            }
            return inventory;
        }

        public static load(_inventorySaveData: InventorySaveData, _gridData: GridData): Inventory {
            const inventory: Inventory = new Inventory();
            for (const item of _inventorySaveData.items) {
                switch (item.type) {
                    case "Equippable":
                        inventory.addItem(Equippable.load(item as EquippableSaveData, _gridData));
                        break;
                    case "Consumable":
                        inventory.addItem(Consumable.load(item, _gridData));
                        break;
                    case "Prop":
                        inventory.addItem(Item.load(item, _gridData));
                }
            }
            return inventory;
        }

        public get used(): number {
            return this.items.length;
        }

        public save(): InventorySaveData {
            return {
                items: this.items.map(x => this.subSave(x))
            };
        }

        public stringify(): string {
            return this.items.map(x => x.stringify()).join(", ");
        }

        public addItem(_add: Item): void {
            this.items.push(_add);
        }

        public getItem(_id: string): Item {
            return this.items.find(x => x.id === _id);
        }

        public removeItem(_remove: Item): void {
            const changedItems: Array<Item> = new Array();
            for (const item of this.items)
                if (item !== _remove)
                    changedItems.push(item);
            this.items = changedItems;
        }

        public hasItem(_id: string): boolean {
            for (const item of this.items)
                if (item.id === _id)
                    return true;
            return false;
        }

        protected subSave(_item: Item): ItemSaveData {
            if (typeof _item as string === "Equippable")
                return (_item as Equippable).save();
            else
                return _item.save();
        }
    }
}