/// <reference path="../character/Character.ts" />
/// <reference path="../event/GameEvent.ts" />
/// <reference path="../grid/Cell.ts" />
/// <reference path="../item/Item.ts" />
/// <reference path="../stat/Effect.ts" />
/// <reference path="Path.ts" />

namespace TextAdventure {
    export class GameFileReader {
        private directory: string;
        private paths: Array<Path>;

        constructor(_directory: string = "gamefiles/") {
            this.directory = _directory;
            this.paths = [
                new Path("cells/", "_cells.json"),
                new Path("characters/", "_characters.json"),
                new Path("effects/", "_effects.json"),
                new Path("events/", "_events.json"),
                new Path("items/", "_items.json")
            ];
        }

        public async read(): Promise<GridData> {
            const cells: Array<CellData> = new Array();
            const characters: Array<CharacterData> = new Array();
            const effects: Array<EffectData> = new Array();
            const events: Array<GameEventData> = new Array();
            const items: Array<ItemData> = new Array();

            const errors: Array<string> = new Array<string>();
            for (const path of this.paths) {
                const completePath: string = this.directory + path.dir;
                try {
                    const response: Response = await fetch(completePath + path.file);
                    const json: Array<string> = await response.json();
                    for (const subPath of json) {
                        path.file = subPath;
                        const subResponse: Response = await fetch(completePath + subPath);

                        switch (path.dir) {
                            case "cells/":
                                const cellData: CellData = await subResponse.json();
                                cells.push(cellData);
                                break;
                            case "characters/":
                                const characterData: CharacterData = await subResponse.json();
                                characters.push(characterData);
                                break;
                            case "effects/":
                                const effectData: EffectData = await subResponse.json();
                                effects.push(effectData);
                                break;
                            case "events/":
                                const eventData: GameEventData = await subResponse.json();
                                events.push(eventData);
                                break;
                            case "items/":
                                const itemData: ItemData = await subResponse.json();
                                items.push(itemData);
                        }
                    }
                } catch (e) {
                    errors.push(path + " " + completePath + path.file);
                }
            }

            return new GridData(cells, characters, effects, events, items);
        }
    }
}