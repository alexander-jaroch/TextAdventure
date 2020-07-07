/// <reference path="Console.ts" />

namespace TextAdventure {
    async function main(): Promise<void> {
        const console: Console = new Console(document);
        const input: string = await console.getInput();
        console.log("> ", input);
    }

    main();
}