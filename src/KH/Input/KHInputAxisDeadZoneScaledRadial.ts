import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * Takes a 2D axis and zeroes out input below the dead zone magnitude, scaling
 * up input as if { 0,0 } begins at the dead zone boundaries. For cases where
 * it's not undesirable for both axes to trigger at once, this is your best bet.
 */
export class KHInputAxisDeadZoneScaledRadial extends KHInputAxisDerived {
    private primaryAxis: KHInputAxis;
    private secondaryAxis: KHInputAxis;
    private deadZone: number;
    
    /**
     * Creates a new KHInputAxisDeadZoneScaledRadial instance.
     * @param inputSet Input set. Used to make sure it gets updated.
     * @param deadZone How far the stick has to be tilted before it registers input (0-1).
     * @param primaryAxis The axis that is being measured by this input.
     * @param secondaryAxis The axis that is used to see if the magnitude exceeds the dead zone.
     */
    constructor(inputSet: KHInputSet, deadZone: number, primaryAxis: KHInputAxis, secondaryAxis: KHInputAxis) {
        super(inputSet);
        this.primaryAxis = primaryAxis;
        this.secondaryAxis = secondaryAxis;
        this.deadZone = Math.min(deadZone, 0.999);
    }

    updateDerivedInput(now: number, delta: number) {
        let primary = this.primaryAxis.getValue();
        let secondary = this.secondaryAxis.getValue();
        const vector = new Phaser.Math.Vector2(primary, secondary);
        const magnitude = Math.min(1, vector.length());
        if (magnitude < this.deadZone) {
            this.update(0);
        } else {
            const normalized = vector.normalize();
            this.update(normalized.x * ((magnitude - this.deadZone) / (1 - this.deadZone)));
        }
    }
}