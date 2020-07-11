/// <reference path="classes/userInterface/Console.ts" />
/// <reference path="classes/FileLoader.ts" />

namespace TextAdventure {

    async function main(): Promise<void> {
        const loader: FileLoader = new FileLoader();
        window.console.log(await loader.load());

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