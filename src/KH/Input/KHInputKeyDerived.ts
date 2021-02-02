import { KHInputKey } from "./KHInputKey";
import { KHIDerivedInput } from "./KHIDerivedInput";
import { KHInputSet } from "./KHInputSet";

export abstract class KHInputKeyDerived extends KHInputKey implements KHIDerivedInput {
    constructor(inputSet: KHInputSet) {
        super();
        if (inputSet) {
            inputSet.addInput(this);
        }
    }

    abstract updateDerivedInput(now: number, delta: number): void;
}