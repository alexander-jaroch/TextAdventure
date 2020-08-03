/// <reference path="../stat/StatList.ts" />
/// <reference path="../story/Story.ts" />

namespace TextAdventure {
    export interface EffectSaveData {
        id: string;
        duration: number;
    }

    export interface EffectData {
        id: string;
        name: string;
        story: StoryData;

        stats: StatList;
        duration: number;
        next: Array<string>;
    }

    export class Effect {
        public readonly id: string;
        public name: string;
        public story: StoryData;

        public stats: StatList;
        public duration: number;
        public next: Array<Effect>;

        public constructor(_id: string, _name: string, _story: StoryData) {
            this.id = _id;
            this.name = _name;
            this.story = _story;

            this.stats = new StatList();
            this.duration = 0;
            this.next = new Array();
        }

        public static init(_effectData: EffectData, _gridData: GridData): Effect {
            const effect: Effect = new Effect(_effectData.id, _effectData.name, _effectData.story);
            const nextData: Array<EffectData> = _gridData.effects.filter(x => _effectData.next.includes(x.id));
            effect.stats = _effectData.stats;
            effect.duration = _effectData.duration;
            effect.next = nextData.map(x => this.init(x, _gridData));
            return effect;
        }

        public static load(_effectSaveData: EffectSaveData, _gridData: GridData): Effect {
            const effectData: EffectData = _gridData.effects.find(x => x.id === _effectSaveData.id);
            const effect: Effect = Effect.init(effectData, _gridData);
            effect.duration = _effectSaveData.duration;
            return effect;
        }

        public save(): EffectSaveData {
            return {
                id: this.id,
                duration: this.duration
            };
        }
    }
}