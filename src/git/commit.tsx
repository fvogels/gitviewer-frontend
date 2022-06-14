import { Vector } from "vector";


export class Commit
{
    constructor(
        public readonly id: string,
        public readonly parents: Commit[],
        public readonly position: Vector
    ) { /* NOP */ }
}
