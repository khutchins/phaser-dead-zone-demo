import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * A key that is run through a lambda before being updated.
 */
export class KHInputKeyProcessed extends KHInputKeyDerived {

    private source: KHInputKey;
    private callback: (isDown: boolean, isJustDown: boolean) => boolean;
    
    constructor(inputSet: KHInputSet, source: KHInputKey, callback: (isDown: boolean, isJustDown: boolean) => boolean) {
        super(inputSet);
    }

    updateDerivedInput(now: number) {
        this.update(this.callback(this.source.isDown(), this.source.isJustDown()));
    }
}
