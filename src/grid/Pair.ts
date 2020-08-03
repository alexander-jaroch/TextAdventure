namespace TextAdventure {
    export class Pair<X, Y> {
        public x: X;
        public y: Y;

        public constructor(_x: X, _y: Y) {
            this.x = _x;
            this.y = _y;
        }
    }

    export class PairedArray<X, Y> {
        private x: Array<X>;
        private y: Array<Y>;

        public constructor(_x: Array<X>, _y: Array<Y>) {
            this.x = _x;
            this.y = _y;
        }

        public get length(): number {
            return Math.min(this.x.length, this.y.length);
        }

        *[Symbol.iterator](): Generator<Pair<X, Y>> {
            for (let i: number = 0; i < this.length; i++)
                yield new Pair(this.x[i], this.y[i]);
        }
    }
}