import { KHInputKey } from "./KHInputKey";

/**
 * An input key that never triggers.
 */
export class KHInputKeyNever extends KHInputKey {
    
    constructor() {
        super();
    }

    update(down) {
        super.update(false);
    }

    protected updateInternal(down: boolean, justDown: boolean) {
        super.updateInternal(false, false);
    }
}
