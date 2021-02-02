import { KHInputAxis } from "./KHInputAxis";
import { KHInputKey } from "./KHInputKey";
import { KHInputProvider } from "./KHInputProvider";

export enum KHMouseInput {
    Left,
    Right,
}

export enum KHMouseAxis {
    X,
    Y,
    Scroll,
}

export enum KHMouseBindableInput {
    LMB = 0,
    LMBTap = 1,
    LMBHold = 2,
    RMB = 3,
    RMBTap = 4,
    RMBHold = 5,
    ScrollUp = 6,
    ScrollDown = 7,
}

export class KHInputProviderMouse extends KHInputProvider {
    scene: Phaser.Scene;

    input: Map<KHMouseInput, KHInputKey>;
    axis: Map<KHMouseAxis, KHInputAxis>;
    /** 
     * Used to store intermediary state for updating scroll wheel. Used because
     * we don't get a callback for no scroll occurring, so we have to clear
     * the value at the end of the frame.
     */
    wheelCallbackState: number;

    static INPUT_TYPE: string = "mouse";

    constructor(scene: Phaser.Scene) {
        super();
        this.scene = scene;
        this.input = new Map();
        this.input.set(KHMouseInput.Left, new KHInputKey());
        this.input.set(KHMouseInput.Right, new KHInputKey());

        this.axis = new Map();
        this.axis.set(KHMouseAxis.X, new KHInputAxis());
        this.axis.set(KHMouseAxis.Y, new KHInputAxis());
        this.axis.set(KHMouseAxis.Scroll, new KHInputAxis());

        this.scene.input.on('wheel', (pointer, currentlyOver, dx, dy, dz, event) => {
            this.wheelCallbackState = pointer.deltaY;
        });
    }

    update(now: number, delta: number): void {
        const pointer = this.scene.input.activePointer;

        this._updateInput(KHMouseInput.Left, pointer.leftButtonDown());
        this._updateInput(KHMouseInput.Right, pointer.rightButtonDown());

        this._updateAxis(KHMouseAxis.X, pointer.x);
        this._updateAxis(KHMouseAxis.Y, pointer.y);

        // Ostensibly we could set scrollwheel from pointer.deltaY here, but
        // that has a strange habit of not getting cleared across frames. By
        // using the callback value and clearing it after reading it, we
        // can ensure it is cleared ourselves.
        this._updateAxis(KHMouseAxis.Scroll, this.wheelCallbackState);
        this.wheelCallbackState = 0;
    }

    private _updateInput(input: KHMouseInput, value: boolean): void {
        this.input.get(input).update(value);
        if (value) {
            KHInputProvider.lastInputSource = this;
        }
    }

    private _updateAxis(axis: KHMouseAxis, value: number): void {
        if (this.axis.get(axis).update(value)) {
            KHInputProvider.lastInputSource = this;
        }
    }

    getInput(input: KHMouseInput): KHInputKey {
        return this.input.get(input);
    }

    getAxis(axis: KHMouseAxis): KHInputAxis {
        return this.axis.get(axis);
    }

    type(): string {
        return KHInputProviderMouse.INPUT_TYPE;
    }

    getId(): string {
        return "Mouse";
    }
}