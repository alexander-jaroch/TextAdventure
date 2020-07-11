namespace TextAdventure {
    export class FileLoader {
        public directory: string;
        public paths: any;

        constructor(_directory: string = "files/", _paths: any = null) {
            this.directory = _directory;
            if (_paths)
                this.paths = _paths;
            else
                this.paths = {
                    cells: { dir: "cells/", file: "_cells.json" },
                    characters: { dir: "characters/", file: "_characters.json" },
                    effects: { dir: "effects/", file: "_effects.json" },
                    events: { dir: "events/", file: "_events.json" },
                    items: { dir: "items/", file: "_items.json" }
                };
        }

        public async load(): Promise<any> {
            const cells: Array<any> = new Array<any>();
            const characters: Array<any> = new Array<any>();
            const effects: Array<any> = new Array<any>();
            const events: Array<any> = new Array<any>();
            const items: Array<any> = new Array<any>();

            const errors: Array<string> = new Array<string>();
            for (const path in this.paths) {
                const completePath: string = this.directory + this.paths[path].dir;
                let pathDetail: string = this.paths[path].file;
                try {
                    const response: Response = await fetch(completePath + pathDetail);
                    const json: any = await response.json();
                    for (const subPath of json) {
                        pathDetail = subPath;
                        const subResponse: Response = await fetch(completePath + subPath);

                        switch (path) {
                            case "cells":
                                const cellData: any = await subResponse.json();
                                cells.push(cellData);
                                break;
                            case "characters":
                                const characterData: any = await subResponse.json();
                                characters.push(characterData);
                                break;
                            case "effects":
                                const effectData: any = await subResponse.json();
                                effects.push(effectData);
                                break;
                            case "events":
                                const eventData: any = await subResponse.json();
                                events.push(eventData);
                                break;
                            case "items":
                                const itemData: any = await subResponse.json();
                                switch (itemData.type) {
                                    case "Consumable":
                                        items.push(itemData); // Cast here
                                        break;
                                    case "Equippable":
                                        items.push(itemData); // Cast here
                                        break;
                                    case "Prop":
                                        items.push(itemData); // Cast here
                                }
                        }
                    }
                } catch (e) {
                    errors.push(path + " " + completePath + pathDetail);
                }
            }

            return {
                cells: cells,
                characters: characters,
                effects: effects,
                events: events,
                items: items
            };
        }
    }
}