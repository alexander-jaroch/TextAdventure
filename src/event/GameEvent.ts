/// <reference path="../character/Character.ts" />
/// <reference path="../story/Story.ts" />

namespace TextAdventure {
    export interface GameEventSaveData {
        id: string;
        active: boolean;
    }

    export interface GameEventData {
        id: string;
        story: EventStory;
        action: string;
    }

    export abstract class GameEvent<T> {
        public readonly id: string;
        public story: EventStory;
        public active: boolean;
        public target: T;

        protected constructor(_id: string, _story: EventStory, _active: boolean) {
            this.id = _id;
            this.story = _story;
            this.active = _active;
        }

        public save(): GameEventSaveData {
            return {
                id: this.id,
                active: this.active
            };
        }

        public abstract fire(_source: Character): boolean;
    }

    export class GameEventParser {
        public static saveGameEvents(_eventList: GameEventList<GameEvent<Cell>>): GameEventList<GameEventSaveData> {
            let saveData: GameEventList<GameEventSaveData> = new GameEventList();
            for (const listener in _eventList)
                saveData[listener] = _eventList[listener].map(x => { return { id: x.id, active: x.active }; });
            return saveData;
        }

        public static parseGameEvents(_eventList: GameEventList<string>, _gridData: GridData, _eventSaveData?: GameEventList<GameEventSaveData>): GameEventList<GameEvent<Cell>> {
            const eventList: CharacterEventList<GameEvent<Cell>> = new CharacterEventList();
            for (const listener in _eventList) {
                const eventData: Array<GameEventData> = _gridData.events.filter(x => _eventList[listener].includes(x.id));
                if (_eventSaveData)
                    eventList[listener] = eventData.map(x => this.conditionalParse(x, _eventSaveData[listener]));
                else
                    eventList[listener] = eventData.map(x => this.conditionalParse(x));
            }
            return eventList;
        }

        private static conditionalParse(_eventData: GameEventData, _eventSaveData?: Array<GameEventSaveData>): GameEvent<Cell> {
            let event: GameEvent<Cell>;
            let temp: GameEventSaveData;
            if (_eventSaveData)
                temp = _eventSaveData.find(x => x.id === _eventData.id);

            switch (_eventData.action.toLowerCase()) {
                case "lock":
                    event = new LockAction(_eventData.id, _eventData.story, temp ? temp.active : true);
                    break;
                case "unlock":
                    event = new UnlockAction(_eventData.id, _eventData.story, temp ? temp.active : true, (_eventData as UnlockActionData).item);
                    break;
            }
            return event;
        }
    }
}