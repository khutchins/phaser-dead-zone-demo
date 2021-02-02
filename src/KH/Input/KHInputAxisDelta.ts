import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An axis that sets its value as the difference between a source's current
 * value and its last value.
 */
export class KHInputAxisDelta extends KHInputAxisDerived {
    private source: KHInputAxis;
    
    constructor(inputSet: KHInputSet, source: KHInputAxis) {
        super(inputSet);
        this.source = source;
    }

    updateDerivedInput(now: number, delta: number) {
        this.update(this.source.getValue() - this.source.getLastValue());
    }
}