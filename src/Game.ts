/// <reference path="grid/Grid.ts" />
/// <reference path="grid/Pair.ts" />

namespace TextAdventure {
    export enum GameState {
        Pre,
        Menu,
        Loading,
        Running,
        Saving,
        Quitting
    }

    export enum Command {
        NewGame,
        Load,
        Save,
        Exit,
        Eeast,
        North,
        West,
        South,
        Up,
        Down,
        Look,
        LookAt,
        NaC
    }

    class FullCommand {
        public regexp: RegExp;
        public command: Command;
        public matches: Array<string>;

        public constructor(_regexp: RegExp, _command: Command) {
            this.regexp = _regexp;
            this.command = _command;
            this.matches = new Array();
        }

        public check(_input: string): boolean {
            this.matches = this.regexp.exec(_input);
            return this.regexp.test(_input);
        }
    }

    export class Game {
        public state: GameState;
        public output: Array<string>;
        private savegame: GridSaveData;
        private grid: Grid;
        private commandMap: Array<FullCommand>;

        public constructor() {
            this.state = GameState.Pre;
            this.output = new Array();
            this.commandMap = [
                new FullCommand(/^new game$/, Command.NewGame),
                new FullCommand(/^load$/, Command.Load),
                new FullCommand(/^save$/, Command.Save),
                new FullCommand(/^(exit|quit)$/, Command.Exit),
                new FullCommand(/^(go )?east$/, Command.Eeast),
                new FullCommand(/^(go )?north$/, Command.North),
                new FullCommand(/^(go )?west$/, Command.West),
                new FullCommand(/^(go )?south$/, Command.South),
                new FullCommand(/^(go )?up$/, Command.Down),
                new FullCommand(/^(go )?down$/, Command.Up),
                new FullCommand(/^look( around)?$/, Command.Look),
                new FullCommand(/^look at (.*)/, Command.LookAt)
            ];
        }

        public get savedata(): string {
            return JSON.stringify(this.savegame);
        }

        public async init(): Promise<void> {
            this.grid = new Grid();
            this.state = GameState.Pre;
            await this.grid.init();
            this.state = GameState.Menu;
            this.output = [
                "Welcome to this Text Adventure Game!",
                "New Game",
                "Load",
                "Exit"
            ];
        }

        public async do(_input: string): Promise<void> {
            const command: FullCommand = this.getCommand(this.prepare(_input));
            switch (this.state) {
                case GameState.Menu:
                    await this.menu(command);
                    break;
                case GameState.Running:
                    await this.ingame(command);
            }
        }

        public async load(_file: File): Promise<void> {
            if (GameState.Loading) {
                if (_file) {
                    const dataString: string = await _file.text();
                    const data: GridSaveData = JSON.parse(dataString);
                    this.grid.load(data);
                    this.state = GameState.Running;
                    this.output = ["You've loaded a savegame..."];
                } else {
                    this.state = GameState.Menu;
                    this.output = ["You've aborted loading a savegame..."];
                }
            }
        }

        public async save(): Promise<void> {
            if (GameState.Saving) {
                this.savegame = this.grid.save();
                this.state = GameState.Running;
                this.output = ["Game saved..."];
            }
        }

        private getDirections(_character: Character, _locked: boolean = false): Array<Pair<FullCommand, Cell>> {
            const found: Array<Pair<string, Cell>> = _character.getDirections(_locked);
            return found.map(x => this.replaceCommand(x));
        }

        private replaceCommand(_pair: Pair<string, Cell>): Pair<FullCommand, Cell> {
            return new Pair(this.getCommand(_pair.x), _pair.y);
        }

        private getCommand(_input: string): FullCommand {
            for (const fullCommand of this.commandMap)
                if (fullCommand.check(_input))
                    return fullCommand;
            return new FullCommand(/ /, Command.NaC);
        }

        private prepare(_command: string): string {
            return _command.trim().toLowerCase();
        }

        private async menu(_fullCommand: FullCommand): Promise<void> {
            switch (_fullCommand.command) {
                case Command.NewGame:
                    await this.new();
                    break;
                case Command.Load:
                    this.state = GameState.Loading;
                    this.output = ["Choose your savegame and press ENTER..."];
                    break;
                case Command.Exit:
                    this.state = GameState.Quitting;
                    this.output = ["quitting game..."];
            }
        }

        private async ingame(_fullCommand: FullCommand): Promise<void> {
            switch (_fullCommand.command) {
                case Command.Save:
                    this.state = GameState.Saving;
                    this.output = ["Saving game. Please enter filename..."];
                    break;
                case Command.Look:
                    this.output = this.random(this.grid.player.cell.story.description);
                    const routes: Array<Pair<FullCommand, Cell>> = this.getDirections(this.grid.player, false);
                    const locked: Array<Pair<FullCommand, Cell>> = this.getDirections(this.grid.player, true);
                    if (routes.length === 0)
                        this.output.push("You have no way to go.");
                    for (const route of routes)
                        this.output.push(`To your ${route.x.matches[0]}, there is ${route.y.name}.`);
                    for (const route of locked)
                        this.output.push(`To your ${route.x.matches[0]}, there is ${route.y.name}. ${this.random(route.y.story.inaccessible).join(". ")}`);
                    for (const character of this.grid.player.cell.characters)
                        this.output.push(`There is ${character.name}.`);
                    for (const item of this.grid.player.cell.inventory.items)
                        this.output.push(`There is ${item.name}.`);
                    break;
                case Command.LookAt:
                    const thing: string = this.prepare(_fullCommand.matches[1]);
                    let found: boolean = false;
                    for (const cell of this.grid.player.cell) {
                        if (cell.name.toLowerCase().includes(thing)) {
                            if (cell.accessible)
                                this.output = this.random(cell.story.description);
                            else
                                this.output = this.random(cell.story.inaccessible);
                            found = true;
                            break;
                        }
                    }
                    for (const item of this.grid.player.cell.inventory.items) {
                        if (item.name.toLowerCase().includes(thing)) {
                            this.output = this.random(item.story.description);
                            found = true;
                            break;
                        }
                    }
                    for (const character of this.grid.player.cell.characters) {
                        if (character.name.toLowerCase().includes(thing)) {
                            this.output = this.random(character.story.description);
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        this.output = ["There is nothing like that."];
                    break;
                case Command.Eeast:
                    
                    break;
                case Command.North:
                    break;
                case Command.West:
                    break;
                case Command.South:
                    break;
                case Command.Up:
                    break;
                case Command.Down:
                    break;
                case Command.Exit:
                    this.state = GameState.Menu;
                    await this.init();
            }
        }

        private async new(): Promise<void> {
            if (GameState.Menu) {
                this.grid.newGame();
                this.state = GameState.Running;
                this.output = ["You've started a new game..."];
            }
        }

        private random(_array: Array<string>): Array<string> {
            const rand: number = Math.floor(Math.random() * _array.length);
            return [_array[rand]];
        }
    }
}