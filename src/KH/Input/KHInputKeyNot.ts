import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * A key that is inverted.
 */
export class KHInputKeyNot extends KHInputKeyDerived {

    private source: KHInputKey;
    
    constructor(inputSet: KHInputSet, source: KHInputKey) {
        super(inputSet);
    }

    updateDerivedInput(now: number) {
        this.update(!this.source.isDown());
    }
}
