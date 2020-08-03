/// <reference path="../character/Character.ts" />
/// <reference path="../story/Story.ts" />
/// <reference path="GameEvent.ts" />

namespace TextAdventure {
    export interface UnlockActionData extends GameEventData {
        item: string;
    }

    export class UnlockAction extends GameEvent<Cell> {
        private item: string;

        public constructor(_id: string, _story: EventStory, _active: boolean, _item: string) {
            super(_id, _story, _active);
            this.item = _item;
        }

        public fire(_source: Character): boolean {
            if (this.active && this.target && _source && _source.inventory.hasItem(this.item)) {
                _source.inventory.removeItem(_source.inventory.getItem(this.item));
                this.target.accessible = true;
                this.active = false;
                return true;
            }
            return false;
        }
    }
}