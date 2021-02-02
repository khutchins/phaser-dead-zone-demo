import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputAxisDerived } from "./KHInputAxisDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * Takes a 2D axis and zeroes out input below the dead zone magnitude, with no
 * scaling applied. Additionally, it applies an axial dead zone based on the
 * magnitude of the opposing input (linearly interpolating 0–maxAxialDeadZone 
 * based on the input value).
 */
export class KHInputAxisDeadZoneBowTie extends KHInputAxisDerived {
    private primaryAxis: KHInputAxis;
    private secondaryAxis: KHInputAxis;
    private radialDeadZone: number;
    private maxAxialDeadZone: number;
    
    /**
     * Creates a new KHInputAxisDeadZoneBowTie instance.
     * @param inputSet Input set. Used to make sure it gets updated.
     * @param radialDeadZone The base value for how far the stick has to be tilted before it registers input (0-1).
     * @param maxAxialDeadZone The maximum axial dead zone, linearly interpolated between zero and this value based on the value of the opposing axis.
     * @param primaryAxis The axis that is being measured by this input.
     * @param secondaryAxis The axis that is used to see if the magnitude exceeds the dead zone.
     */
    constructor(inputSet: KHInputSet, radialDeadZone: number, maxAxialDeadZone: number, primaryAxis: KHInputAxis, secondaryAxis: KHInputAxis) {
        super(inputSet);
        this.primaryAxis = primaryAxis;
        this.secondaryAxis = secondaryAxis;
        this.radialDeadZone = Math.min(radialDeadZone, 0.999);
        this.maxAxialDeadZone = Math.min(maxAxialDeadZone, 0.999);
    }

    updateDerivedInput(now: number, delta: number) {
        let primary = this.primaryAxis.getValue();
        let secondary = this.secondaryAxis.getValue();

        // The "bow tie" part of this is made up of two components: a center
        // radial dead zone and an axial dead zone that increases linearly with
        // the opposing axis's size.
        const axialDeadZone = Math.min(1, Math.abs(secondary)) * this.maxAxialDeadZone;

        // Check if the input is within the axial dead zone.
        if (Math.abs(primary) < axialDeadZone) {
            this.update(0);
            return;
        }

        // Check if the input is within the radial dead zone.
        const vector = new Phaser.Math.Vector2(primary, secondary);
        const magnitude = vector.length();
        if (magnitude < this.radialDeadZone) {
            this.update(0);
        } else {
            this.update(primary);
        }
    }
}