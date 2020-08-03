/// <reference path="../character/Character.ts" />
/// <reference path="../story/Story.ts" />
/// <reference path="GameEvent.ts" />

namespace TextAdventure {
    export class LockAction extends GameEvent<Cell> {
        public constructor(_id: string, _story: EventStory, _active: boolean) {
            super(_id, _story, _active);
        }

        public fire(_source: Character): boolean {
            if (this.active && this.target && _source) {
                this.target.accessible = false;
                this.active = false;
                return true;
            }
            return false;
        }
    }
}