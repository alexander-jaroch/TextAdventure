/// <reference path="../Vector3D.ts" />
/// <reference path="../cell/CellData.ts" />

namespace TextAdventure {
    export interface GridData {
        cells: Array3D<Cell>;
        size: Vector3D;
    }
}