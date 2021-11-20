class ButtonUIElement extends UIElement {
    constructor(label, command) {
        super();
        this.command = command;
        this.sprite = new Sprite(Services.get("ASSET").get("Images/Gui/button.png"));
        this.position = this.sprite.position;
        this.size = this.sprite.size;
        this.collideBox = new RectCollideBox(this.position, this.size);
        this.textUIElement = new TextUIElement(label, "black", "bold 24pt neuropol");
        this.hoverSound = new SoundPool(Services.get("ASSET").get("Sounds/Hover_Digital_06_wav.wav"), 10);
        this.clickSound = Services.get("ASSET").get("Sounds/Click_Digital_06_wav.wav");
        this.previouslyHover = this.hover = false;
    }

    setPosition(position) {
        super.setPosition(position);
        this.sprite.position = position;
        this.collideBox.position = this.position;
    }

    setAlpha(alpha) {
        this.sprite.globalAlpha = alpha;
        this.textUIElement.setAlpha(alpha);
    }

    getAlpha() {
        return this.sprite.globalAlpha;
    }

    update(dt) {
        super.update(dt);
        this.textUIElement.position.x = this.position.x + (this.size.x - this.textUIElement.size.x) / 2;
        this.textUIElement.position.y = this.position.y + this.size.y * 0.3;

        let inputHandler = Services.get("INPUT");
        this.previouslyHover = this.hover;
        this.hover = this.visibility && Collider.isPointInRectangle(inputHandler.mouse, this.collideBox);
        if (this.hover) {
            if (!this.previouslyHover) {
                this.hoverSound.play();
            }
            if (inputHandler.isClicked()) {
                this.command.execute();
            }
        }
    }

    draw(context) {
        super.draw(context);
        if (this.visibility) {
            this.sprite.draw(context);
            this.textUIElement.draw(context);
        }
    }    
}
