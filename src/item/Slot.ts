namespace TextAdventure {
    export enum Slot {
        Primary,
        Secondary,
        Head,
        Body,
        Inventory
    }

    export class SlotParser {
        public static parse(_slots: Array<string>): Array<Slot> {
            const slotMap: { [key: string]: Slot } = {
                Primary: Slot.Primary,
                Secondary: Slot.Secondary,
                Head: Slot.Head,
                Body: Slot.Body
            };

            return _slots.map(x => slotMap[x]);
        }
    }
}