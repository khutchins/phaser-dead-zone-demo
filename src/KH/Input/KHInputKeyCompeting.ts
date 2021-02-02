import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An input key that is competing with another input key. It is considered down
 * if it is down AND the competing input is either up or pressed down BEFORE
 * this one OR this is preferred and both were pressed at the same time.
 */
export class KHInputKeyCompeting extends KHInputKeyDerived {
    source: KHInputKey;
    competing: KHInputKey;
    lastDown: KHInputKey;
    inputIsPreferred: boolean;
    
    constructor(inputSet: KHInputSet, source: KHInputKey, competing: KHInputKey, inputIsPreferred: boolean) {
        super(inputSet);
        this.source = source;
        this.competing = competing;
        this.inputIsPreferred = inputIsPreferred;
    }

    updateDerivedInput() {
        if (this.source.isJustDown() && this.competing.isJustDown()) {
            this.lastDown = this.inputIsPreferred ? this.source : this.competing;
        } else if (this.source.isJustDown()) {
            this.lastDown = this.source;
        } else if (this.competing.isJustDown()) {
            this.lastDown = this.competing;
        }

        if (this.lastDown && !this.lastDown.isDown()) {
            if (this.source.isDown()) this.lastDown = this.source;
            else if (this.competing.isDown()) this.lastDown = this.competing;
            else this.lastDown = null;
        }

        this.update(this.lastDown == this.source && this.lastDown.isDown());
    }
}
