import { KHInputProviderController } from "./KHInputProviderController";
import { KHInputProviderKeyboard } from "./KHInputProviderKeyboard";
import { KHInputProviderMouse } from "./KHInputProviderMouse";
import { KHIDerivedInput } from "./KHIDerivedInput";
import { KHIInputRegistrar } from "./KHIInputRegistrar";
import { KHInputSet } from "./KHInputSet";

export class KHInputScene extends Phaser.Scene implements KHIInputRegistrar {
    
    static SharedInput: KHInputScene;

    controllerProviders: KHInputProviderController[];
    keyboardProvider: KHInputProviderKeyboard;
    mouseProvider: KHInputProviderMouse;

    registeredInputSets: Set<KHInputSet>;

    constructor() {
        super("KHInputScene");
        console.log("Instantiated");
        this.registeredInputSets = new Set();
        KHInputScene.SharedInput = this;
    }

    registerInputSet(inputSet: KHInputSet) {
        this.registeredInputSets.add(inputSet);
        if (this.registeredInputSets.size > 10) {
            console.log("Registered input sets", this.registeredInputSets);
        }
    }

    unregisterInputSet(inputSet: KHInputSet) {
        this.registeredInputSets.delete(inputSet);
    }

    create() {
        this.controllerProviders = [ 
            new KHInputProviderController(this, 0),
            new KHInputProviderController(this, 1),
            new KHInputProviderController(this, 2),
            new KHInputProviderController(this, 3)
        ];
        this.keyboardProvider = new KHInputProviderKeyboard(this);
        this.mouseProvider = new KHInputProviderMouse(this);
        this.events.on('preupdate', (now, delta) => {
            this.updateInputs(now, delta);
        }, this);
    }

    private updateInputs(now: number, delta: number): void {
        // Update mouse inputs first so that bumping the mouse while holding a
        // button doesn't trigger mouse movement.
        this.mouseProvider.update(now, delta);
        for (let i = 0; i < this.controllerProviders.length; i++) {
            this.controllerProviders[i].update(now, delta);
        }
        this.keyboardProvider.update(now, delta);

        // Registered derived inputs must be iterated in the order that they're
        // registered, as this guarantees that a derived input's inputs will
        // be updated before it is, preventing extra input latency.
        this.registeredInputSets.forEach(function(value) {
            for (let i = 0; i < value.inputs.length; i++) {
                value.inputs[i].updateDerivedInput(now, delta);
            }
        })
    }
}