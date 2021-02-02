import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An input key that requires any of the keys its listening on to be true to 
 * trigger.
 */
export class KHInputKeyOr extends KHInputKeyDerived {
    private sources: KHInputKey[];
    private retriggerOnEveryJustDown: boolean;
    
    /**
     * 
     * @param inputSet Input set
     * @param sources Keys to listen on
     * @param retriggerOnEveryJustDown Whether or not any input source emitting justDown should make this input emit it as well.
     */
    constructor(inputSet: KHInputSet, sources: KHInputKey[], retriggerOnEveryJustDown: boolean = false) {
        super(inputSet);
        this.sources = sources;
        this.retriggerOnEveryJustDown = retriggerOnEveryJustDown;

        // Clear out just down if not applicable.
        this.setInitalState();
    }

    private setInitalState() {
        let jd = false;
        let down = false;
        for (let i = 0; i < this.sources.length; i++) {
            if (this.sources[i].isDown()) {
                down = true;
            }
            if (this.sources[i].isJustDown()) {
                jd = true;
            }
        }
        this.down = down;
        this.justDown = jd;
    }

    updateDerivedInput() {
        let anyDown: boolean = false;
        let anyJustDown: boolean = false;

        if (this.retriggerOnEveryJustDown) {
            for (let i = 0; i < this.sources.length; i++) {
                if (this.sources[i].isDown()) {
                    anyDown = true;
                }
                if (this.sources[i].isJustDown()) {
                    anyJustDown = true;
                }
            }

            super.updateInternal(anyDown, anyJustDown);
        }
        else {
            for (let i = 0; i < this.sources.length; i++) {
                if (this.sources[i].isDown()) {
                    anyDown = true;
                    break;
                }
            }

            super.update(anyDown);
        }
    }
}
