import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An axis that combines multiple axes and responds with the highest one.
 */
export class KHInputAxisHighestMagnitude extends KHInputAxisDerived {
    private sources: KHInputAxis[];
    
    constructor(inputSet: KHInputSet, sources: KHInputAxis[]) {
        super(inputSet);
        this.sources = sources;
    }

    updateDerivedInput(now: number, delta: number) {
        let highestMagnitude = 0;
        let highestMagnitudeValue = 0;
        this.sources.forEach((element) => {
            const value = element.getValue();
            let absValue = Math.abs(value);
            if (absValue > highestMagnitude) {
                highestMagnitude = absValue;
                highestMagnitudeValue = value;
            }
        })
        this.update(highestMagnitudeValue);
    }
}