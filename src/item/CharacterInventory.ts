/// <reference path="Inventory.ts" />
/// <reference path="Slot.ts" />

namespace TextAdventure {
    export class CharacterInventorySaveData extends InventorySaveData {
        equipment: Array<EquippableSaveData>;
        size: number;
    }

    export class CharacterInventory extends Inventory {
        public equipment: Array<Equippable>;
        public size: number;

        public constructor(_size: number) {
            super();
            this.equipment = new Array(Slot.Inventory + 1);
            this.size = _size;
        }

        public static initCharacterInventory(_itemData: Array<ItemData>, _equippableData: Array<ItemData>, _gridData: GridData, _size: number): CharacterInventory {
            const inventory: CharacterInventory = new CharacterInventory(_size);
            for (const equipment of _equippableData) {
                const equippable: Equippable = Equippable.init(equipment as EquippableData, _gridData);
                for (const slot of equippable.slots) {
                    inventory.equipment[slot] = equippable;
                }
            }
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

        public static load(_inventorySaveData: CharacterInventorySaveData, _gridData: GridData): CharacterInventory {
            const inventory: CharacterInventory = new CharacterInventory(_inventorySaveData.size);
            for (const equipment of _inventorySaveData.equipment) {
                if (equipment) {
                    const equippable: Equippable = Equippable.load(equipment, _gridData);
                    for (const slot of equippable.slots) {
                        inventory.equipment[slot] = equippable;
                    }
                }
            }
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

        public get free(): number {
            return this.size - this.used;
        }

        public save(): CharacterInventorySaveData {
            return {
                items: this.items.map(x => this.subSave(x)),
                equipment: this.equipment.map(x => x.save()),
                size: this.size
            };
        }

        public stringify(): string {
            return this.equipment.map(x => x.stringify()).filter(x => x !== "").join(", ") + " | " + super.stringify();
        }

        public addItem(_add: Item): boolean {
            if (this.free === 0)
                return false;
            super.addItem(_add);
            return true;
        }

        public unequip(_unequip: Equippable): boolean {
            if (this.free === 0)
                return false;
            if (_unequip && this.equipment.includes(_unequip)) {
                this.addItem(_unequip);
                for (let i: number = 0; i < this.equipment.length; i++)
                    if (this.equipment[i] === _unequip)
                        delete this.equipment[i];
            }
            return true;
        }

        public equip(_equip: Equippable): boolean {
            const occupyingItems: Array<Equippable> = this.getOccupyingItems(_equip);
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

        private getOccupyingItems(_equip: Equippable): Array<Equippable> {
            const occupyingItems: Array<Equippable> = new Array();
            for (const slot of _equip.slots)
                if (!occupyingItems.includes(this.equipment[slot]))
                    occupyingItems.push(this.equipment[slot]);
            return occupyingItems;
        }
    }
}