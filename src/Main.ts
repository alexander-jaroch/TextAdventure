/// <reference path="classes/userInterface/Console.ts" />

namespace TextAdventure {

    async function main(): Promise<void> {
        const console: Console = new Console(document);
        let input: string;
        do {
            input = await console.getInput();
            console.log(">", input);
        }
        while (!/exit|quit|q/.test(input));
        console.exit();
    }

    main();

}