import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * Takes an axis and zeroes out input below the dead zone boundary, scaling
 * up input as if { 0,0 } begins at the dead zone boundaries. For cases where
 * it's destructive to have another direction accidentally trigger, this is your
 * best bet. Otherwise, use scaled radial.
 * 
 * Cases where you might want this: A game with 4-way 2D movement, tetris, where
 * moving left and right move your piece, and moving up does a hard drop.
 */
export class KHInputAxisDeadZoneScaledAxial extends KHInputAxisDerived {
    private source: KHInputAxis;
    private deadZone: number;
    
    /**
     * Creates a new KHInputAxisDeadZoneAxialScaled instance.
     * @param inputSet Input set. Used to make sure it gets updated.
     * @param deadZone How far the stick has to be tilted before it registers input (0-1).
     * @param source The axis that is being measured by this input.
     */
    constructor(inputSet: KHInputSet, deadZone: number, source: KHInputAxis) {
        super(inputSet);
        this.source = source;
        this.deadZone = Math.min(deadZone, 0.999);
    }

    updateDerivedInput(now: number, delta: number) {
        let value = this.source.getValue();
        if (Math.abs(value) < this.deadZone) {
            this.update(0);
        } 
        else {
            this.update(Math.sign(value) * (Math.abs(value) - this.deadZone) / (1 - this.deadZone));
        }
    }
}