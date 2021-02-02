import { KHInputKey } from "./KHInputKey";
import { KHInputProvider } from "./KHInputProvider";

class  KHInputKeyKeyboard extends KHInputKey {
    private key: Phaser.Input.Keyboard.Key;
    constructor(key: Phaser.Input.Keyboard.Key) {
        super();
        this.key = key;
    }

    updateFromKey(): boolean {
        this.update(this.key.isDown);
        return this.down;
    }
}

export class KHInputProviderKeyboard extends KHInputProvider {
    scene: Phaser.Scene;

    keys: Map<any, KHInputKeyKeyboard>;

    static INPUT_TYPE: string = "keyboard";

    constructor(scene: Phaser.Scene) {
        super();
        this.scene = scene;
        this.keys = new Map();
    }

    update(now: number, delta: number) {
        this.keys.forEach((value, key) => {
            if (value.updateFromKey()) {
                KHInputProvider.lastInputSource = this;
            }
        })
    }

    getInput(input: any /* Should be Phaser.Input.Keyboard.KeyCodes but TS gets mad if I do that */): KHInputKey {
        if (!this.keys.has(input)) {
            const phaserKey = this.scene.input.keyboard.addKey(input);
            const inputKey: KHInputKeyKeyboard = new KHInputKeyKeyboard(phaserKey);

            const justDown = Phaser.Input.Keyboard.JustDown(phaserKey);
            const down = phaserKey.isDown;

            // Populate key isDown.
            if (down) {
                inputKey.update(down);
            }
            // Clear out justDown if it isn't just down.
            if (!justDown) {
                inputKey.update(down);
            }

            this.keys.set(input, inputKey);
        }
        const value = this.keys.get(input);
        return value;
    }

    isDown(input: any /* Should be Phaser.Input.Keyboard.KeyCodes but TS gets mad if I do that */) {
        return this.getInput(input).isDown();
    }

    isJustDown(input: any /* Should be Phaser.Input.Keyboard.KeyCodes but TS gets mad if I do that */) {
        return this.getInput(input).isJustDown();
    }

    type(): string {
        return KHInputProviderKeyboard.INPUT_TYPE;
    }

    getId(): string {
        return "Keyboard";
    }
}