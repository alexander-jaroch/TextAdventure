namespace TextAdventure {
    export interface StoryData {
        description: Array<string>;
    }

    export interface CellStory extends StoryData {
        inaccessible: Array<string>;
    }

    export interface CharacterStory extends StoryData {
        wounded: Array<string>;
        dead: Array<string>;
    }

    export interface ItemStory extends StoryData {
        usedByPlayer: Array<string>;
        usedOnPlayer: Array<string>;
        usedOnOther: Array<string>;
    }
    
    export interface EventStory extends StoryData {
        success: Array<string>;
        failiure: Array<string>;
    }
}