import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An input key that will retrigger on every frame.
 * 
 * This input can have a just down without a previous not down, so be aware if
 * you're chaining inputs on top of it. One caveat is that KHInputKeyOr and And
 * both have a derived justDown based on the combination of their input keys,
 * so they will consume the justDown without emitting it.
 */
export class KHInputKeyRepeatEveryFrame extends KHInputKeyDerived {
    private key: KHInputKey;
    
    constructor(inputSet: KHInputSet, key: KHInputKey) {
        super(inputSet);
        this.key = key;
    }

    updateDerivedInput(now: number) {
        let down = this.key.isDown();
        this.updateInternal(down, down);
    }
}
