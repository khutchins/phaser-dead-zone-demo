import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * You should not use this. Use ScaledRadial instead.
 * 
 * Takes a 2D axis and zeroes out input below the dead zone magnitude, 
 * leaving the rest unscaled.
 */
export class KHInputAxisDeadZoneRadial extends KHInputAxisDerived {
    private primaryAxis: KHInputAxis;
    private secondaryAxis: KHInputAxis;
    private deadZone: number;
    
    /**
     * Creates a new KHInputAxisDeadZoneRadial instance.
     * @param inputSet Input set. Used to make sure it gets updated.
     * @param deadZone How far the stick has to be tilted before it registers input (0-1).
     * @param primaryAxis The axis that is being measured by this input.
     * @param secondaryAxis The axis that is used to see if the magnitude exceeds the dead zone.
     */
    constructor(inputSet: KHInputSet, deadZone: number, primaryAxis: KHInputAxis, secondaryAxis: KHInputAxis) {
        super(inputSet);
        this.primaryAxis = primaryAxis;
        this.secondaryAxis = secondaryAxis;
        this.deadZone = deadZone;
    }

    updateDerivedInput(now: number, delta: number) {
        let primary = this.primaryAxis.getValue();
        let secondary = this.secondaryAxis.getValue();
        const vector = new Phaser.Math.Vector2(primary, secondary);
        const magnitude = vector.length();

        this.update(magnitude < this.deadZone ? 0 : primary);
    }
}