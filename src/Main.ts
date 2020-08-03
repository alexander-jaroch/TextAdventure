/// <reference path="userInterface/Console.ts" />
/// <reference path="Game.ts" />

namespace TextAdventure {

    async function main(): Promise<void> {

        const game: Game = new Game();
        await game.init();

        const console: Console = new Console(document);
        let input: string;
        do {
            console.log(...game.output);

            switch (game.state) {
                case GameState.Loading:
                    const file: File = await console.upload();
                    await game.load(file);
                    break;
                case GameState.Saving:
                    await game.save();
                    input = await console.getInput();
                    console.download(game.savedata, `${input}.json`, "application/json");
                    break;
                default:
                    input = await console.getInput();
                    console.log(`> ${input}`);
                    await game.do(input);
            }
        }
        while (game.state != GameState.Quitting);
        console.log(...game.output);
        console.exit();
    }

    main();

}