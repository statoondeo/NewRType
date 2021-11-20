// Gestion des transitions de début et de fin de scène (fondu au noir dans les 2 cas)
class FlashingLayer extends GameObject {
    constructor(image) {
        super();
        this.partition = "NEUTRAL_PARTITION";
        this.sprite = new Sprite(image);
        this.sprite.globalAlpha = 0.5;
        this.visibilityTtl = this.visibilityMaxTtl = 1;
        this.status = "IDLE";
    }

    show() {
        this.status = "ACTIVE";
        this.visibilityTtl = this.visibilityMaxTtl;
        this.sprite.globalAlpha = 1;
    }

    update(dt) {
        super.update(dt);
        if (this.status == "ACTIVE") {
            this.visibilityTtl -= dt;
            if (this.visibilityTtl < 0) {
                this.status = "IDLE";               
            }
            this.sprite.globalAlpha = this.visibilityTtl / this.visibilityMaxTtl;
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}