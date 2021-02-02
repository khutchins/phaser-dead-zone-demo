import { KHInputKey } from "./KHInputKey";
import { KHInputKeyDerived } from "./KHInputKeyDerived";
import { KHInputSet } from "./KHInputSet";

/**
 * An input key that requires all of the keys its listening on to be true before
 * it will trigger.
 */
export class KHInputKeyAnd extends KHInputKeyDerived {
    protected requiresReset: boolean;
    private sources: KHInputKey[];
    
    constructor(inputSet: KHInputSet, sources: KHInputKey[]) {
        super(inputSet);
        this.sources = sources;

        this.setInitalState();
    }

    private setInitalState() {
        let jd = false;
        let down = true;
        for (let i = 0; i < this.sources.length; i++) {
            if (!this.sources[i].isDown()) {
                down = false;
            }
            if (this.sources[i].isJustDown()) {
                jd = true;
            }
        }
        this.down = down;
        this.justDown = jd;
    }

    updateDerivedInput() {
        let allDown: boolean = true;

        for (let i = 0; i < this.sources.length; i++) {
            if (!this.sources[i].isDown()) {
                allDown = false;
                break;
            }
        }

        super.update(allDown);
    }
}
