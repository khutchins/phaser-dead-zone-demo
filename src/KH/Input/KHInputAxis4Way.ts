import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * Takes a 2D axis and converts it as if it were a 4-way D-pad input. No dead
 * zone will be applied. Have it wrap a dead zone axis if that behavior is 
 * desired. Will return the axis's value, and will *not* coerce it to 1.
 */
export class KHInputAxis4Way extends KHInputAxisDerived {
    private primaryAxis: KHInputAxis;
    private secondaryAxis: KHInputAxis;
    private preferred: boolean;
    
    /**
     * Creates a new KHInputAxis4Way instance.
     * @param inputSet Input set. Used to make sure it gets updated.
     * @param primaryAxis The axis that is being measured by this input.
     * @param secondaryAxis The axis that is used to see if the magnitude exceeds the dead zone.
     * @param preferred If both inputs are the same, should this axis win out.
     */
    constructor(inputSet: KHInputSet, primaryAxis: KHInputAxis, secondaryAxis: KHInputAxis, preferred: boolean) {
        super(inputSet);
        this.primaryAxis = primaryAxis;
        this.secondaryAxis = secondaryAxis;
    }

    updateDerivedInput(now: number, delta: number) {
        let primary = this.primaryAxis.getValue();
        let secondary = this.secondaryAxis.getValue();
        let absPrimary = Math.abs(primary);
        let absSecondary = Math.abs(secondary);
        if (absPrimary > absSecondary || (this.preferred && absPrimary == absSecondary)) {
            this.update(primary);
        } else {
            this.update(0);
        }
    }
}