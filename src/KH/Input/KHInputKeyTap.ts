import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * Input source that triggers when a key is pressed for less than a given
 * amount of time.
 */
export class KHInputKeyTap extends KHInputKeyDerived {
    private source: KHInputKey;
    private maxTime: number;

    private timeHeld: number = 0;
    private downLastFrame: boolean;

    constructor(inputSet: KHInputSet, source: KHInputKey, maxTimeExclusive: number) {
        super(inputSet);
        this.source = source;
        this.maxTime = maxTimeExclusive;

        // Clear out just down if not applicable.
        this.setInitalState();
    }

    private setInitalState(): void {
        this.down = false;
        this.justDown = false;
    }

    updateDerivedInput(now: number, delta: number) {
        let isNowDown = false;
        if (this.source.isDown()) {
            if (!this.source.isJustDown()) {
                this.timeHeld += delta;
            }
            this.downLastFrame = true;
        } else if (!this.source.isDown() && this.downLastFrame) {
            if (this.timeHeld < this.maxTime) {
                isNowDown = true;
            }
            this.timeHeld = 0;
            this.downLastFrame = false;
        }
        super.update(isNowDown);
    }
}