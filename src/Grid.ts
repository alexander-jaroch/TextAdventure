/// <reference path="Cell.ts" />
/// <reference path="Vector2.ts" />

namespace TextAdventure {
    interface GridData {
        cells: Array<Array<CellData>>;
        size: Vector2;
    }

    export class Grid {
        public cells: Array<Array<Cell>>;

        public constructor() {
            this.cells = new Array<Array<Cell>>();
        }

        public loadGrid(_json: string): void {
            const gridData: GridData = JSON.parse(_json);
            for (let y: number; y < gridData.size.y; y++) {
                for (let x: number; x < gridData.size.x; x++) {
                    const cellData: CellData = gridData.cells[y][x];
                    // TO DO create objects of subclasses from Cell
                    console.log(cellData); // Placeholder
                }
            }
        }
    }
}