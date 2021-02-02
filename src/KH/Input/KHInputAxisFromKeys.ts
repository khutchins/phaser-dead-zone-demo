import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputKey } from "./KHInputKey";
import { KHInputSet } from "./KHInputSet";

/**
 * An axis that translates two keys into positive and negative inputs for an
 * axis, adding 1 for a pressed positive key, and subtracting 1 for a pressed
 * negative key.
 */
export class KHInputAxisFromKeys extends KHInputAxisDerived {
    private positiveKey: KHInputKey;
    private negativeKey: KHInputKey;
    
    constructor(inputSet: KHInputSet, positiveKey: KHInputKey, negativeKey: KHInputKey = null) {
        super(inputSet);
        this.positiveKey = positiveKey;
        this.negativeKey = negativeKey;
    }

    updateDerivedInput(now: number, delta: number) {
        this.update((this.positiveKey?.isDown() ? 1 : 0) 
                    + (this.negativeKey?.isDown() ? -1 : 0));
    }
}