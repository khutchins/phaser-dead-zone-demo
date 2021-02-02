import { DZDMainScene } from "./DZDMainScene";
import { KHInputScene } from "./KH/Input/KHInputScene";

export enum DeadZoneType {
    Raw,
    Axial,
    ScaledAxial,
    Radial,
    ScaledRadial,
    BowTie,
    ScaledBowTie,
    DPad4Way,
    DPad8Way,
}

// This scene guarantees that KHInputScene's create is called before 
// DZDMainScene's.
class MultiSceneStarter extends Phaser.Scene {
    constructor() {
        super("MultiSceneStarter");
    }

    preload() {
        this.scene.run("KHInputScene");
    }

    create() {
        this.scene.start("DZDMainScene");
    }
}

function makeGame(parentDiv: string, type: DeadZoneType): Phaser.Game {
    const config = {
        type: Phaser.AUTO,
        scale: {
            width: 600,
            height: 300,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        },
        input: {
            gamepad: true,
        },
        parent: parentDiv,
        scene: [ MultiSceneStarter, DZDMainScene, KHInputScene ],
        physics: { default: 'arcade' },
    };
    const game = new Phaser.Game(config);
    (game as any).deadZoneType = type;
    return game;
}

module.exports = {
    makeGame: makeGame,
    deadZoneType: DeadZoneType,
};