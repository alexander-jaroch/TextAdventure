/// <reference path="../cell/Cell.ts" />
/// <reference path="../cell/CellData.ts" />
/// <reference path="./GridData.ts" />

namespace TextAdventure {
    export class Grid {
        public cells: Array<Array<Cell>>;

        public constructor() {
            this.cells = new Array<Array<Cell>>();
        }

        public loadGrid(_gridData: GridData): void {
            for (let y: number; y < _gridData.size.y; y++) {
                for (let x: number; x < _gridData.size.x; x++) {
                    const cellData: CellData = _gridData.cells[y][x];
                    // TO DO create objects of subclasses from Cell
                    console.log(cellData); // Placeholder
                }
            }
        }
    }
}