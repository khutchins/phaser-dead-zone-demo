import { KHInputSet } from "./KHInputSet";

export interface KHIInputRegistrar {
    registerInputSet(inputSet: KHInputSet);
    unregisterInputSet(inputSet: KHInputSet);
}