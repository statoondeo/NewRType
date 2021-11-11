class PanelUIElement  extends UIElement {
    constructor(position, size, visibility) {
        super(visibility);
        this.position = position;
        this.size = size;
        this.internalUIElement = [];
        this.pendingVisibility = false;
        this.alphaDirection = 0;
        this.visibilityMaxTtl = 0.5;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    addElement(element) {
        element.visibility = this.visibility;
        element.setAlpha(this.getAlpha());        
        element.setPosition(new Vec2(element.position.x + this.position.x, element.position.y + this.position.y));
        this.internalUIElement.push(element);
    }

    setVisibility(visibility) {
        this.visibility = visibility;
        this.internalUIElement.forEach(element => {
            element.visibility = this.visibility;
        });        
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.globalAlpha = alpha;
        this.internalUIElement.forEach(element => {
            element.setAlpha(alpha);
        });
    }

    getAlpha() {
        return this.globalAlpha;
    }

    hide() {
        this.setAlpha(1);
        this.pendingVisibility = true;
        this.alphaDirection = -1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    show() {
        this.setAlpha(0);
        this.setVisibility(true);
        this.pendingVisibility = true;
        this.alphaDirection = 1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    update(dt) {
        super.update(dt);
        if (this.pendingVisibility) {
            this.visibilityTtl -= dt;
            if (this.visibilityTtl <= 0) {
                this.pendingVisibility = false;
                this.setVisibility(this.alphaDirection < 0 ? false : this.alphaDirection);
            }
            else {
                this.setAlpha(this.alphaDirection > 0 ? (this.visibilityMaxTtl - this.visibilityTtl) / this.visibilityMaxTtl : this.visibilityTtl / this.visibilityMaxTtl);
            }
        }
        this.internalUIElement.forEach(element => {
            element.update(dt);
        });
    }

    draw(context) {
        if (this.visibility) {
            this.internalUIElement.forEach(element => {
                element.draw(context);
            });
        }
    }    
}
