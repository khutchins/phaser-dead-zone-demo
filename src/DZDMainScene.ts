import { DeadZoneType } from "./Game";
import { KHInputAxis } from "./KH/Input/KHInputAxis";
import { KHInputAxis4Way } from "./KH/Input/KHInputAxis4Way";
import { KHInputAxis8Way } from "./KH/Input/KHInputAxis8Way";
import { KHInputAxisDeadZoneAxial } from "./KH/Input/KHInputAxisDeadZoneAxial";
import { KHInputAxisDeadZoneBowTie } from "./KH/Input/KHInputAxisDeadZoneBowTie";
import { KHInputAxisDeadZoneRadial } from "./KH/Input/KHInputAxisDeadZoneRadial";
import { KHInputAxisDeadZoneScaledAxial } from "./KH/Input/KHInputAxisDeadZoneScaledAxial";
import { KHInputAxisDeadZoneScaledBowTie } from "./KH/Input/KHInputAxisDeadZoneScaledBowTie";
import { KHInputAxisDeadZoneScaledRadial } from "./KH/Input/KHInputAxisDeadZoneScaledRadial";
import { KHInputKey } from "./KH/Input/KHInputKey";
import { KHPadAxis, KHPadInput } from "./KH/Input/KHInputProviderController";
import { KHInputScene } from "./KH/Input/KHInputScene";
import { KHInputSet } from "./KH/Input/KHInputSet";

export class DZDMainScene extends Phaser.Scene {

    inputSet: KHInputSet;

    player: Phaser.GameObjects.Rectangle;

    thumbstickCircle: Phaser.GameObjects.Graphics;
    thumbstickPositionRaw: Phaser.GameObjects.Graphics;
    thumbstickPositionDeadZone: Phaser.GameObjects.Graphics;

    rawAxisText: Phaser.GameObjects.Text;
    deadZoneAxisText: Phaser.GameObjects.Text;
    controllerIdText:  Phaser.GameObjects.Text;
    deadZoneTypeText:  Phaser.GameObjects.Text;
    thresholdText:  Phaser.GameObjects.Text;

    thumbstickCircleRadius: number = 100;
    thumbstickCenter: Phaser.Geom.Point = new Phaser.Geom.Point(450, 175);

    rawAxisX: KHInputAxis;
    deadZoneAxisX: KHInputAxis;

    rawAxisY: KHInputAxis;
    deadZoneAxisY: KHInputAxis;

    deadZoneDecrease: KHInputKey;
    deadZoneIncrease: KHInputKey;

    deadZone: number = 0.25;
    deadZoneType: DeadZoneType;

    constructor() {
        super("DZDMainScene");
    }

    create() {
        this.events.on("shutdown", () => {
            this.inputSet?.unregister();
        })

        this.thumbstickCircle = this.add.graphics().lineStyle(5, 0xFFFFFF, 1).setPosition(this.thumbstickCenter.x, this.thumbstickCenter.y);
        this.thumbstickCircle.strokeCircle(0, 0, this.thumbstickCircleRadius);

        this.thumbstickPositionRaw = this.add.graphics().lineStyle(10, 0xFF0000, 1).setPosition(this.thumbstickCenter.x, this.thumbstickCenter.y);
        this.thumbstickPositionRaw.strokeCircle(0, 0, 1);
        this.setStickPosition(this.thumbstickPositionRaw, 0, 0);

        this.thumbstickPositionDeadZone = this.add.graphics().lineStyle(3, 0x00FFFF, 1);
        this.thumbstickPositionDeadZone.strokeCircle(0, 0, 5);
        this.setStickPosition(this.thumbstickPositionDeadZone, 0, 0);
        
        this.deadZoneType = (this.game as any).deadZoneType ?? DeadZoneType.Raw;

        this.rawAxisText = this.add.text(350, 15, 'Raw: ', { color: '#ffff00', align: 'center' });
        this.deadZoneAxisText = this.add.text(350, 35, 'Dead:', { color: '#ffff00', align: 'center' });
        this.controllerIdText = this.add.text(5, 15, 'No Controller Detected', { color: '#ffff00', align: 'center' });
        this.deadZoneTypeText = this.add.text(5, 35, 'Type: ' + this.textForDeadZoneType(this.deadZoneType), { color: '#ffff00', align: 'center' });
        this.thresholdText = this.add.text(235, 35, 'Dead: ' + this.deadZone.toFixed(2), { color: '#ffff00', align: 'center' });
        this.updateDeadZone(0.25);

        const inset = 10;
        const y = 35 + 15;
        const worldBounds = new Phaser.Geom.Rectangle(inset, 
            y + inset, 
            this.thumbstickCenter.x - this.thumbstickCircleRadius - inset * 2, 
            300 - y - inset * 2);

        const worldSquareBounds = this.add.rectangle(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height).setOrigin(0);
        worldSquareBounds.setStrokeStyle(2, 0x666666);

        this.physics.world.setBounds(worldBounds.x, worldBounds.y, worldBounds.width, worldBounds.height);

        const playerSize = 10;
        this.player = this.add.rectangle(worldBounds.x + worldBounds.width/2, worldBounds.y + worldBounds.height/2, playerSize, playerSize, 0x008800);
        this.physics.add.existing(this.player);
        (this.player.body as any).setCollideWorldBounds(true);

        const controller = KHInputScene.SharedInput.controllerProviders[0];
        
        this.deadZoneDecrease = controller.getInput(KHPadInput.L1);
        this.deadZoneIncrease = controller.getInput(KHPadInput.R1);

        this.updateAxes();
    }

    setStickPosition(stick: Phaser.GameObjects.Graphics, x: number, y: number) {
        stick.setPosition(this.thumbstickCenter.x + this.thumbstickCircleRadius * x, this.thumbstickCenter.y + this.thumbstickCircleRadius * y);
    }

    axisForDeadZoneType(type: DeadZoneType, rawPrimaryAxis: KHInputAxis, rawSecondaryAxis: KHInputAxis, isX: boolean, inputSet: KHInputSet) {
        switch (type) {
            case DeadZoneType.Raw:
                return rawPrimaryAxis;
            case DeadZoneType.Axial:
                return new KHInputAxisDeadZoneAxial(inputSet, this.deadZone, rawPrimaryAxis);
            case DeadZoneType.Radial:
                return new KHInputAxisDeadZoneRadial(inputSet, this.deadZone, rawPrimaryAxis, rawSecondaryAxis);
            case DeadZoneType.ScaledAxial:
                return new KHInputAxisDeadZoneScaledAxial(inputSet, this.deadZone, rawPrimaryAxis);
            case DeadZoneType.ScaledRadial:
                return new KHInputAxisDeadZoneScaledRadial(inputSet, this.deadZone, rawPrimaryAxis, rawSecondaryAxis);
            case DeadZoneType.BowTie:
                return new KHInputAxisDeadZoneBowTie(inputSet, this.deadZone, 0.15, rawPrimaryAxis, rawSecondaryAxis);
            case DeadZoneType.ScaledBowTie:
                return new KHInputAxisDeadZoneScaledBowTie(inputSet, this.deadZone, 0.15, rawPrimaryAxis, rawSecondaryAxis);
            case DeadZoneType.DPad4Way:
                return new KHInputAxis4Way(inputSet, 
                    new KHInputAxisDeadZoneScaledRadial(inputSet, this.deadZone, rawPrimaryAxis, rawSecondaryAxis), 
                    new KHInputAxisDeadZoneScaledRadial(inputSet, this.deadZone, rawSecondaryAxis, rawPrimaryAxis), 
                    isX);
            case DeadZoneType.DPad8Way:
                return new KHInputAxis8Way(inputSet, 
                    new KHInputAxisDeadZoneScaledRadial(inputSet, this.deadZone, rawPrimaryAxis, rawSecondaryAxis), 
                    new KHInputAxisDeadZoneScaledRadial(inputSet, this.deadZone, rawSecondaryAxis, rawPrimaryAxis));
        }
    }

    textForDeadZoneType(type: DeadZoneType) {
        switch (type) {
            case DeadZoneType.Raw:
                return "Raw";
            case DeadZoneType.Axial:
                return "Axial";
            case DeadZoneType.Radial:
                return "Radial";
            case DeadZoneType.ScaledAxial:
                return "Scaled Axial";
            case DeadZoneType.ScaledRadial:
                return "Scaled Radial";
            case DeadZoneType.BowTie:
                return "Bow Tie";
            case DeadZoneType.ScaledBowTie:
                return "Scaled Bow Tie";
            case DeadZoneType.DPad4Way:
                return "4-Way D-Pad";
            case DeadZoneType.DPad8Way:
                return "8-Way D-Pad";
        }
    }

    update(now: number, delta: number) {
        // With multiple instances of a Phaser.Game in a single page,
        // controllerProviders is sometimes set to null. There's some sort of
        // strange interactions going on between them, but it doesn't seem
        // worth my time to look into them.
        if (KHInputScene.SharedInput.controllerProviders == null) {
            return;
        }
        const controller = KHInputScene.SharedInput.controllerProviders[0];
        controller.getGamepad()?.setAxisThreshold(0);

        this.setControllerText(controller ? controller.getId() : "No Controller Detected");
        this.setStickPosition(this.thumbstickPositionRaw, this.rawAxisX.getValue(), this.rawAxisY.getValue());
        this.setStickPosition(this.thumbstickPositionDeadZone, this.deadZoneAxisX.getValue(), this.deadZoneAxisY.getValue());

        this.rawAxisText.setText(`Raw: (${this.numberString(this.rawAxisX.getValue())}, ${this.numberString(this.rawAxisY.getValue())})`);
        this.deadZoneAxisText.setText(`Dead:(${this.numberString(this.deadZoneAxisX.getValue())}, ${this.numberString(this.deadZoneAxisY.getValue())})`);

        const maxSpeed = 150;
        let moveVector = new Phaser.Math.Vector2(this.deadZoneAxisX.getValue(), this.deadZoneAxisY.getValue());
        if (moveVector.lengthSq() > 1) {
            moveVector = moveVector.normalize();
        }
        this.player.body.velocity.x = moveVector.x * maxSpeed;
        this.player.body.velocity.y = moveVector.y * maxSpeed;

        if (this.deadZoneDecrease.isJustDown()) {
            this.updateDeadZone(this.deadZone - 0.05);
        }
        if (this.deadZoneIncrease.isJustDown()) {
            this.updateDeadZone(this.deadZone + 0.05);
        }
    }

    updateDeadZone(newValue: number) {
        this.deadZone = Math.max(0, Math.min(newValue, 1));
        this.updateAxes();
        if (this.deadZoneType == DeadZoneType.Raw) {
            this.thresholdText.setText("Dead: " + " N/A");
        } else {
            this.thresholdText.setText("Dead: " + this.deadZone.toFixed(2));
        }
    }

    updateAxes() {
        if (!KHInputScene.SharedInput.controllerProviders) {
            return;
        }
        const controller = KHInputScene.SharedInput.controllerProviders[0];
        if (!controller) {
            return;
        }
        
        this.inputSet?.unregister();
        this.inputSet = new KHInputSet("main-scene");
        this.inputSet.registerWith(KHInputScene.SharedInput);

        this.rawAxisX = KHInputScene.SharedInput.controllerProviders[0].getAxis(KHPadAxis.LeftStickX);
        this.rawAxisY = KHInputScene.SharedInput.controllerProviders[0].getAxis(KHPadAxis.LeftStickY);

        this.deadZoneAxisX = this.axisForDeadZoneType(this.deadZoneType, this.rawAxisX, this.rawAxisY, true, this.inputSet);
        this.deadZoneAxisY = this.axisForDeadZoneType(this.deadZoneType, this.rawAxisY, this.rawAxisX, false, this.inputSet);
    }

    numberString(num: number) {
        if (num >= 0) {
            return " " + num.toFixed(3);
        } else {
            return num.toFixed(3);
        }
    }

    setControllerText(text: string) {
        this.controllerIdText.setText(text.length > 34 ? text.substr(0, 31) + "..." : text);
    }
}