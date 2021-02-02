import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An axis that is run through a lambda before being updated.
 */
export class KHInputAxisProcessed extends KHInputAxisDerived {
    private source: KHInputAxis;
    private callback: (value: number) => number;
    
    constructor(inputSet: KHInputSet, source: KHInputAxis, callback: (value: number) => number) {
        super(inputSet);
        this.source = source;
        this.callback = callback;
    }

    updateDerivedInput(now: number, delta: number) {
        let value = this.callback(this.source.getValue());
        this.update(value);
    }
}
