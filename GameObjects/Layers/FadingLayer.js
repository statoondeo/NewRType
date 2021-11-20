// Gestion des transitions de début et de fin de scène (fondu au noir dans les 2 cas)
class FadingLayer extends GameObject {
    constructor(image, initialVisibility) {
        super();
        this.partition = "NEUTRAL_PARTITION";
        this.sprite = new Sprite(image);
        this.initialVisibility = initialVisibility;
        this.sprite.globalAlpha = this.initialVisibility ? 1 : 0;
        this.pendingVisibility = false;
        this.visibilityTtl = 0;
        this.visibilityMaxTtl = 1;
        this.layer = 100;
        this.showCommand = this.hideCommand = null;
    }

    hide(command) {
        this.hideCommand = command;
        this.pendingVisibility = true;
        this.alphaDirection = -1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    show(command) {
        this.showCommand = command;
        this.pendingVisibility = true;
        this.alphaDirection = 1;
        this.visibilityTtl = 0;
    }
    
    getRatio() {
        return this.visibilityTtl / this.visibilityMaxTtl;
    }

    update(dt) {
        super.update(dt);
        if (this.pendingVisibility) 
        {
            this.visibilityTtl += this.alphaDirection * dt;
            if (this.visibilityTtl < 0 || this.visibilityTtl > this.visibilityMaxTtl) {
                this.pendingVisibility = false;
                this.visibilityTtl = 0
                if (this.alphaDirection == 1 && this.showCommand != null) {
                    this.showCommand.execute();
                }
                if (this.alphaDirection == -1 && this.hideCommand != null) {
                    this.hideCommand.execute();
                }
            }
            else {
                this.sprite.globalAlpha = this.getRatio();
            }
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}