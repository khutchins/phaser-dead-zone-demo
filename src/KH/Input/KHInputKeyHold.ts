import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * Input source that triggers when a key is pressed for at least a given amount
 * of time.
 */
export class KHInputKeyHold extends KHInputKeyDerived {
    private source: KHInputKey;
    private minTime: number;

    private timeHeld: number = 0;

    constructor(inputSet: KHInputSet, source: KHInputKey, minTimeInclusive: number) {
        super(inputSet);
        this.source = source;
        this.minTime = minTimeInclusive;

        // Clear out just down if not applicable.
        this.setInitalState();
    }

    private setInitalState(): void {
        this.down = false;
        this.justDown = false;
    }

    updateDerivedInput(now: number, delta: number) {
        let isNowDown = false;

        if (this.source.isDown() && !this.source.isJustDown()) {
            this.timeHeld += delta;
        } 

        // This can't be part of the previous conditional or it would break
        // with a min hold time of 0. It doesn't make sense to *set* a min hold
        // time of zero (that's just a normal key), but no sense in putting in
        // a gotcha.
        if (this.source.isDown()) {
            if (this.timeHeld >= this.minTime) {
                isNowDown = true;
            }
        } else {
            this.timeHeld = 0;
        }
        super.update(isNowDown);
    }
}