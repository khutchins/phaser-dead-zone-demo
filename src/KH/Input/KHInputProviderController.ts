import { KHInputAxis } from "./KHInputAxis";
import { KHInputKey } from "./KHInputKey";
import { KHInputProvider } from "./KHInputProvider";

export enum KHPadInput {
    Left,
    Right,
    Up,
    Down,
    A,
    B,
    X,
    Y,
    Select,
    Start,
    L1,
    R1,
}

export enum KHPadAxis {
    LeftStickX,
    LeftStickY,
    RightStickX,
    RightStickY,
}

export class KHInputProviderController extends KHInputProvider {

    scene: Phaser.Scene;
    buttons: Map<KHPadInput, KHInputKey>;
    axis: Map<KHPadAxis, KHInputAxis>;
    gamePadNumber: number;

    static INPUT_TYPE: string = "controller";

    constructor(scene: Phaser.Scene, gamePadNumber: number) {
        super();
        this.scene = scene;

        this.gamePadNumber = gamePadNumber;

        this.buttons = new Map();
        this.buttons.set(KHPadInput.A, new KHInputKey());
        this.buttons.set(KHPadInput.B, new KHInputKey());
        this.buttons.set(KHPadInput.X, new KHInputKey());
        this.buttons.set(KHPadInput.Y, new KHInputKey());
        this.buttons.set(KHPadInput.Left, new KHInputKey());
        this.buttons.set(KHPadInput.Right, new KHInputKey());
        this.buttons.set(KHPadInput.Up, new KHInputKey());
        this.buttons.set(KHPadInput.Down, new KHInputKey());
        this.buttons.set(KHPadInput.Start, new KHInputKey());
        this.buttons.set(KHPadInput.Select, new KHInputKey());
        this.buttons.set(KHPadInput.L1, new KHInputKey());
        this.buttons.set(KHPadInput.R1, new KHInputKey());

        this.axis = new Map();
        this.axis.set(KHPadAxis.LeftStickX, new KHInputAxis());
        this.axis.set(KHPadAxis.LeftStickY, new KHInputAxis());
        this.axis.set(KHPadAxis.RightStickX, new KHInputAxis());
        this.axis.set(KHPadAxis.RightStickY, new KHInputAxis());
    }

    tryVibrate(duration: number, weak: number, strong: number) {
        let gamepad = this.getGamepad();
        if (!gamepad) {
            return;
        }
        let haptics = gamepad.vibration;
        if (haptics) {
            // playEffect is more flexible, so attempt to use that first
            if ((haptics as any).playEffect) {
                (haptics as any).playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: duration,
                    weakMagnitude: weak,
                    strongMagnitude: strong,
                });
            } else if (haptics.pulse) {
                let strength = Math.max(weak, strong);
                haptics.pulse(strength, duration);
            }
        }
    }

    updateDisconnect() {
        this.buttons.forEach((value, key) => {
            value.update(false);
        })
    }

    getGamepad(): Phaser.Input.Gamepad.Gamepad | null {
        if (!this.scene.input.gamepad || this.gamePadNumber >= this.scene.input.gamepad.gamepads.length) {
            this.updateDisconnect();
            return null;
        }
        let gamePad  = this.scene.input.gamepad.gamepads[this.gamePadNumber];
        if (!gamePad) {
            this.updateDisconnect();
            return null;
        }
        return gamePad;
    }

    update(now: number, delta: number) {
        let gamePad = this.getGamepad();
        if (!gamePad) return;

        this._updateInput(KHPadInput.A, gamePad.A);
        this._updateInput(KHPadInput.B, gamePad.B);
        this._updateInput(KHPadInput.X, gamePad.X);
        this._updateInput(KHPadInput.Y, gamePad.Y);
        this._updateInput(KHPadInput.Left, gamePad.left);
        this._updateInput(KHPadInput.Right, gamePad.right);
        this._updateInput(KHPadInput.Up, gamePad.up);
        this._updateInput(KHPadInput.Down, gamePad.down);
        this._updateInput(KHPadInput.Start, gamePad.getButtonValue(9) == 1);
        this._updateInput(KHPadInput.Select, gamePad.getButtonValue(8) == 1);
        this._updateInput(KHPadInput.L1, gamePad.L1 > 0.9);
        this._updateInput(KHPadInput.R1, gamePad.R1 > 0.9);

        this._updateAxis(KHPadAxis.LeftStickX, gamePad.leftStick.x);
        this._updateAxis(KHPadAxis.LeftStickY, gamePad.leftStick.y);
        this._updateAxis(KHPadAxis.RightStickX, gamePad.rightStick.x);
        this._updateAxis(KHPadAxis.RightStickY, gamePad.rightStick.y);
    }

    private _updateInput(input: KHPadInput, value: boolean) {
        this.buttons.get(input).update(value);
        if (value) {
            KHInputProvider.lastInputSource = this;
        }
    }

    private _updateAxis(axis: KHPadAxis, value: number) {
        if (this.axis.get(axis).update(value)) {
            KHInputProvider.lastInputSource = this;
        }
    }

    getInput(input: KHPadInput): KHInputKey {
        return this.buttons.get(input);
    }

    getAxis(axis: KHPadAxis): KHInputAxis {
        return this.axis.get(axis);
    }

    isDown(input: KHPadInput) {
        return this.buttons.get(input).isDown();
    }

    isJustDown(input: KHPadInput) {
        return this.buttons.get(input).isJustDown();
    }

    type(): string {
        return KHInputProviderController.INPUT_TYPE;
    }

    getId(): string {
        const gamepad = this.getGamepad();
        if (gamepad) {
            return gamepad.id;
        } else {
            return "Detached Controller";
        }
    }
}