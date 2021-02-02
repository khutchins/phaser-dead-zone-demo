import { KHInputKey } from "./KHInputKey";
import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * Converts an axis to a key based on a given threshold. If threshold is 
 * positive, it will check if the axis value is >= threshold. If the threshold is
 * negative, it will check that the axis value is <= threshold.
 */
export class KHInputKeyKeyFromAxis extends KHInputKeyDerived {
    private source: KHInputAxis;
    private threshold: number;

    constructor(inputSet: KHInputSet, source: KHInputAxis, threshold: number) {
        super(inputSet);
        this.source = source;
        this.threshold = threshold;
    }

    updateDerivedInput(_now: number, _delta: number) {
        if (this.threshold < 0) {
            this.update(this.source.getValue() <= this.threshold)
        } else {
            this.update(this.source.getValue() >= this.threshold)
        }
    }
}