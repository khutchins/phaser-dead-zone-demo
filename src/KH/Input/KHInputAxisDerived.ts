import { KHIDerivedInput } from "./KHIDerivedInput";
import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputSet } from "./KHInputSet";

export abstract class KHInputAxisDerived extends KHInputAxis implements KHIDerivedInput {
    constructor(inputSet: KHInputSet) {
        super();
        if (inputSet) {
            inputSet.addInput(this);
        }
    }

    abstract updateDerivedInput(now: number, delta: number): void;
}