import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputSet } from "./KHInputSet";

/**
 * An input key that can be manually reset. If reset, the underlying input key
 * must be unpressed and repressed before it will be considered down again.
 */
export class KHInputKeyResettable extends KHInputKeyDerived {
    protected requiresReset: boolean;
    private source: KHInputKey;
    
    constructor(inputSet: KHInputSet, source: KHInputKey) {
        super(inputSet);
        this.source = source;
    }

    reset() {
        this.requiresReset = true;
        super.update(false);
    }

    updateDerivedInput() {
        this.requiresReset = this.requiresReset && this.source.isDown();
        super.update(this.source.isDown() && !this.requiresReset);
    }

    update(down: boolean) {
        // Clear requires reset if no longer down.
        this.requiresReset = this.requiresReset && down;
        super.update(down && !this.requiresReset);
    }
}
