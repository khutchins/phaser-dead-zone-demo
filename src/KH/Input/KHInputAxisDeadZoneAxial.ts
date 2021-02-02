import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * You should not use this.
 * 
 * Takes an axis and zeroes out input below the dead zone boundary, leaving the 
 * rest unscaled. This will result in a discontinuity of input. For cases where
 * it's destructive to have another direction accidentally trigger, use 
 * scaled axial. Otherwise, use scaled radial.
 * 
 */
export class KHInputAxisDeadZoneAxial extends KHInputAxisDerived {
    private source: KHInputAxis;
    private deadZone: number;
    
    /**
     * Creates a new KHInputAxisDeadZoneAxial instance.
     * @param inputSet Input set. Used to make sure it gets updated.
     * @param deadZone How far the stick has to be tilted before it registers input (0-1).
     * @param source The axis that is being measured by this input.
     */
    constructor(inputSet: KHInputSet, deadZone: number, source: KHInputAxis) {
        super(inputSet);
        this.source = source;
        this.deadZone = deadZone;
    }

    updateDerivedInput(now: number, delta: number) {
        let value = this.source.getValue();
        this.update(Math.abs(value) < this.deadZone ? 0 : value);
    }
}