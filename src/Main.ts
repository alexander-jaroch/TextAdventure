/// <reference path="classes/CommandMap.ts" />
/// <reference path="classes/userInterface/Console.ts" />

namespace TextAdventure {

    async function main(): Promise<void> {
        const console: Console = new Console(document);
        let input: string;
        do {
            input = await console.getInput();
            console.log(">", input);
        }
        while (!CommandMap.exit(input));
        console.exit();
    }

    main();

}