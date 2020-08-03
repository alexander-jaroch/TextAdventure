/// <reference path="../stat/Effect.ts" />
/// <reference path="../story/Story.ts" />
/// <reference path="Item.ts" />

namespace TextAdventure {
    export interface ConsumableData extends ItemData {
        effects: Array<string>;
        throwable: boolean;
    }

    export class Consumable extends Item {
        public effects: Array<Effect>;
        public throwable: boolean;

        public constructor(_id: string, _name: string, _story: ItemStory, _effects: Array<Effect>, _throwable: boolean) {
            super(_id, _name, _story);
            this.effects = _effects;
            this.throwable = _throwable;
        }

        public static init(_consumableData: ConsumableData, _gridData: GridData): Consumable {
            const effectData: Array<EffectData> = _gridData.effects.filter(x => _consumableData.effects.includes(x.id));
            const consumable: Consumable = new Consumable(
                _consumableData.id,
                _consumableData.name,
                _consumableData.story as ItemStory,
                effectData.map(x => Effect.init(x, _gridData)),
                _consumableData.throwable
            );
            return consumable;
        }

        public static load(_itemSaveData: ItemSaveData, _gridData: GridData): Consumable {
            const consumableData: ConsumableData = _gridData.items.find(x => x.id === _itemSaveData.id) as ConsumableData;
            const effectData: Array<EffectData> = _gridData.effects.filter(x => consumableData.effects.includes(x.id));
            const consumable: Consumable = new Consumable(
                consumableData.id,
                consumableData.name,
                consumableData.story as ItemStory,
                effectData.map(x => Effect.init(x, _gridData)),
                consumableData.throwable
            );
            return consumable;
        }
    }
}