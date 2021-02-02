import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputAxis } from "./KHInputAxis";
import { KHInputKey } from "./KHInputKey";
import { KHInputSet } from "./KHInputSet";

export class KHInputHandler {
    scene: Phaser.Scene;
    keyMappings: Map<string, KHInputKey[]>;
    axisMappings: Map<string, KHInputAxis>;
    readonly inputSet: KHInputSet;

    constructor(scene: Phaser.Scene, inputs: { [key: string]: KHInputKey | KHInputKey[] }, axes: { [key: string]: KHInputAxis }, inputSet: KHInputSet) {
        this.scene = scene;
        this.keyMappings = new Map();
        for (const key in inputs) {
            let val = inputs[key];
            if (val instanceof KHInputKey) {
                val = [ val ];
            }
            this.keyMappings.set(key, val);
        }

        this.axisMappings = new Map();
        for (const key in axes) {
            this.axisMappings.set(key, axes[key]);
        }

        this.inputSet = inputSet;
    }

    register(registrar: KHIInputRegistrar) {
        this.inputSet.registerWith(registrar);
    }

    unregister() {
        this.inputSet.unregister();
    }

    /**
     * Returns if key was pressed down this frame.
     */
    isJustDown(key: string): boolean {
        if (!this.inputSet.registered()) {
            console.warn("Attempting to get inputs with unregistered input set. Call register first.");
        }
        let mappings: KHInputKey[] = this.keyMappings.get(key);
        if (!mappings) { 
            console.log(`No mappings for ${key}`);
            return;
        }

        for (let i = 0; i < mappings.length; i++) {
            if (mappings[i].isJustDown()) return true;
        }

        return false;
    }

    /**
     * Returns if key is currently down.
     */
    isDown(key: string): boolean {
        if (!this.inputSet.registered()) {
            console.warn("Attempting to get inputs with unregistered input set. Call register first.");
        }
        let mappings: KHInputKey[] = this.keyMappings.get(key);
        if (!mappings) { 
            console.log(`No mappings for ${key}`);
            return;
        }

        for (let i = 0; i < mappings.length; i++) {
            if (mappings[i].isDown()) return true;
        }
        
        return false;
    }

    /**
     * Returns an axis's value.
     */
    value(key: string): number {
        if (!this.inputSet.registered()) {
            console.warn("Attempting to get inputs with unregistered input set. Call register first.");
        }
        let mapping: KHInputAxis = this.axisMappings.get(key);
        if (!mapping) { 
            console.log(`No mapping for ${key}`);
            return;
        }
        return mapping.getValue();
    }

    /**
     * Returns an axis's last value.
     */
    lastValue(key: string): number {
        if (!this.inputSet.registered()) {
            console.warn("Attempting to get inputs with unregistered input set. Call register first.");
        }
        let mapping: KHInputAxis = this.axisMappings.get(key);
        if (!mapping) { 
            console.log(`No mapping for ${key}`);
            return;
        }
        return mapping.getLastValue();
    }

    /**
     * Returns when an axis changed value.
     */
    changed(key: string): boolean {
        if (!this.inputSet.registered()) {
            console.warn("Attempting to get inputs with unregistered input set. Call register first.");
        }
        let mapping: KHInputAxis = this.axisMappings.get(key);
        if (!mapping) { 
            console.log(`No mapping for ${key}`);
            return;
        }
        return mapping.changed();
    }
}