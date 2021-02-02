import { Scene } from "phaser";

export class KHContainer extends Phaser.GameObjects.Container {
    c_w: number;
    c_h: number;
    private bgColor: number;
    private bgAlpha: number;
    private borderWidth: number;
    private clipsToBounds: boolean;

    private bg: Phaser.GameObjects.Rectangle;

    /**
     * A Phaser container that allows bounds to be set.
     * @param scene Scene the container belongs to.
     * @param x x offset
     * @param y y offset
     * @param w width
     * @param h height
     * @param bg_color Color of background (hex)
     * @param bg_alpha Alpha of background (0-1)
     * @param border_width How much the background should go beyond the clipped area.
     * @param clips_to_bounds If contents outside container bounds should be masked.
     */
    constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, bg_color: number = null, bg_alpha: number = 0, border_width: number = 0, clips_to_bounds: boolean = false) {
        super(scene, x, y);
        this.redrawInternal(w, h, bg_color, bg_alpha, border_width, clips_to_bounds);
        scene.add.existing(this);
    }

    resize(w: number, h: number) {
        this.redrawInternal(w, h);
    }

    setBackground(color: number, alpha: number) {
        this.redrawInternal(this.c_w, this.c_h, color, alpha);
    }

    private redrawInternal(w: number, h: number, bgColor: number = this.bgColor, bgAlpha: number = this.bgAlpha, borderWidth: number = this.borderWidth, clipsToBounds: boolean = this.clipsToBounds) {
        // Redraw mask
        if (w != this.c_w || h != this.c_h || clipsToBounds != this.clipsToBounds) {
            this.clearMask(true);
            if (clipsToBounds) {
                this.setMask(new Phaser.Display.Masks.BitmapMask(this.scene,
                    this.scene.make.graphics({ fillStyle: { color: 0x0 }, add: false }).fillRect(this.x, this.y, w, h)));
            }
        }
        // Redraw background
        if (w != this.c_w || h != this.c_h || bgColor != this.bgColor || bgAlpha != this.bgAlpha) {
            if (this.bg) { 
                this.bg.destroy();
                this.bg = null;
            }
            if (bgColor !== null && bgAlpha > 0) {
                this.bg = this.scene.add.rectangle(-borderWidth, -borderWidth, w + borderWidth * 2, h + borderWidth * 2, bgColor, bgAlpha).setOrigin(0).setDepth(0);
                this.add(this.bg);
                this.sendToBack(this.bg);
            }
        }
        this.c_w = w;
        this.c_h = h;
        this.bgColor = bgColor;
        this.bgAlpha = bgAlpha;
        this.borderWidth = borderWidth;
        this.clipsToBounds = clipsToBounds;
    }

    addImage(x: number, y: number, texture: string) {
        const img = this.scene.add.image(x, y, texture);
        this.add(img);
        return img;
    }
}