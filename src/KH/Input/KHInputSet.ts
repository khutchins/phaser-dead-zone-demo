import { KHIDerivedInput } from "./KHIDerivedInput";
import { KHIInputRegistrar } from "./KHIInputRegistrar";
/**
 * A set of derived inputs that defines all of the inputs for a given scope.
 * They are combined to allow easily clearing unused inputs from the input
 * registrar. Derived inputs must only be included in one KHInputSet, or they
 * will return incorrect values (e.g. losing JustDown from being updated twice
 * in the same frame).
 */
export class KHInputSet {
    /** 
     * Identifer in order to diagnose stale inputs being updated. Does not
     * need to be unique.
     */
    readonly identifier: string;
    /**
     * List of derived inputs tied to a given scope. Child inputs must be in the
     * array before their parents. No derived inputs should be shared across 
     * multiple input sets.
     */
    readonly inputs: KHIDerivedInput[];

    private registrar: KHIInputRegistrar;

    constructor(identifier: string, inputs: KHIDerivedInput[] = []) {
        this.identifier = identifier;
        this.inputs = inputs;
    }

    addInput(input: KHIDerivedInput) {
        this.inputs.push(input);
    }

    registered(): boolean {
        return this.registrar != null;
    }

    registerWith(registrar: KHIInputRegistrar) {
        if (this.registrar) {
            console.warn(`Input set ${this.identifier} already registered. Unregistering from previous set.`);
            this.registrar.unregisterInputSet(this);
        }
        this.registrar = registrar;
        this.registrar?.registerInputSet(this);
    }

    unregister() {
        this.registrar?.unregisterInputSet(this);
    }
}