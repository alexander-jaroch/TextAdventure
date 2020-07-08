/// <reference path="Console.ts" />

namespace TextAdventure {
    interface Rewrites {
        [index: string]: Array<string>;
    }

    async function main(): Promise<void> {
        const console: Console = new Console(document);
        const rewrites: Rewrites = await (await fetch("Rewrites.json")).json();
        let input: string;
        do {
            input = await console.getInput();
            console.log("> ", input);
        }
        while (!rewrites.exit.includes(input));
        console.exit();
    }

    main();
}