import { KHInputKey } from "./KHInputKey";
import { isBetween, looped } from "../KHHelperFunctions";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An input key that will retrigger after an initial delay of X ms, and then 
 * repeat every Y ms after that. This will only perceptively trigger once per
 * frame even if it did repeat more than once.
 * 
 * This input can have a just down without a previous not down, so be aware if
 * you're chaining inputs on top of it.
 */
export class KHInputKeyRepeating extends KHInputKeyDerived {
    private key: KHInputKey;
    private initialDelay: number;
    private incrementalDelay: number;
    private downTime: number;
    private lastTime: number;
    
    constructor(inputSet: KHInputSet, key: KHInputKey, initialDelay: number, incrementalDelay: number) {
        super(inputSet);
        this.key = key;
        this.initialDelay = initialDelay;
        this.incrementalDelay = incrementalDelay;
        this.downTime = null;
        this.lastTime = null;
    }

    updateDerivedInput(now: number) {
        if (this.key.isJustDown()) {
            this.downTime = now;
            this.lastTime = now;
            this.updateInternal(true, true);
            return;
        } else if (!this.key.isDown()) {
            this.updateInternal(false, false);
            return;
        }

        let lastDiff = this.lastTime - this.downTime;
        let diff = now - this.downTime;
        let justDown = false;
        if (isBetween(lastDiff, this.initialDelay, diff) || /* Initial delay elapsed */
            (diff > this.initialDelay && looped(lastDiff - this.initialDelay, this.incrementalDelay, diff - this.initialDelay))) { // More than incremental delay elapsed.
            justDown = true;
        }
        this.updateInternal(true, justDown);
        this.lastTime = now;
    }
}
