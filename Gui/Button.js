class UIElement extends GameObject {
    constructor(visibility = true) {
        super();
        this.visibility = visibility;
        this.globalAlpha = this.visibility ? 1 : 0;
        
        // Les éléments d'interface sont observables
        this.observers = [];
    }

    registerObserver(observer) {
        this.observers.push(observer);
    }
    
    unregisterObserver(observer) {
        let index = this.observers.indexOf(observer);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }

    notify(property) {
        this.observers.forEach(observer => {
            observer.subjectChanged(this, property);
        });
    }

    setAlpha(alpha) {
        this.globalAlpha = alpha;
    }

    getAlpha() {
        return this.globalAlpha;
    }
}

class BigPanelUIElement extends UIElement{
    constructor(position, image, visibility) {
        super(visibility);
        this.sprite = new Sprite(image);
        this.position = position;
        this.sprite.position = this.position;
        this.size = this.sprite.size;
        this.internalUIElement = [];
        this.pendingVisibility = false;
        this.alphaDirection = 0;
        this.visibilityMaxTtl = 1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    addElement(element) {
        element.setAlpha(this.getAlpha());
        element.position.x += this.position.x;
        element.position.y += this.position.y;
        this.internalUIElement.push(element);
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.sprite.globalAlpha = alpha;
        this.internalUIElement.forEach(element => {
            element.setAlpha(alpha);
        });
    }

    getAlpha() {
        return this.sprite.globalAlpha;
    }

    hide() {
        this.setAlpha(1);
        this.pendingVisibility = true;
        this.alphaDirection = -1;
        this.visibilityTtl = this.visibilityMaxTtl;
        this.notify("hide");
    }

    show() {
        this.setAlpha(0);
        this.visibility = true;
        this.pendingVisibility = true;
        this.alphaDirection = 1;
        this.visibilityTtl = this.visibilityMaxTtl;
        this.notify("show");
    }

    update(dt) {
        if (this.pendingVisibility) {
            this.visibilityTtl -= dt;
            if (this.visibilityTtl <= 0) {
                this.pendingVisibility = false;
                this.visibility = this.alphaDirection < 0 ? false : this.alphaDirection;
            }
            else {
                this.setAlpha(this.alphaDirection > 0 ? (this.visibilityMaxTtl - this.visibilityTtl) / this.visibilityMaxTtl : this.visibilityTtl / this.visibilityMaxTtl);
            }
        }
        this.sprite.update(dt);
        this.internalUIElement.forEach(element => {
            element.update(dt);
        });
    }

    draw(context) {
        if (this.visibility) {
            this.sprite.draw(context);
            this.internalUIElement.forEach(element => {
                element.draw(context);
            });
        }
    }
}

class SmallPanelUIElement extends BigPanelUIElement {
    static size = new Vec2(619, 614);
    static miniatureOffset = new Vec2(92, 96)
    constructor(image, position, miniature, visibility) {
        super(position, image, visibility);
        this.miniature = miniature;
        this.miniature.globalAlpha = this.globalAlpha;
        this.position = position;
        this.miniature.position.x = this.position.x + SmallPanelUIElement.miniatureOffset.x - this.miniature.size.x / 2;
        this.miniature.position.y = this.position.y + SmallPanelUIElement.miniatureOffset.y - this.miniature.size.y / 2;
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.miniature.globalAlpha = alpha;
    }

    update(dt) {
        super.update(dt);
        this.miniature.update(dt);
    }

    draw(context) {
        super.draw(context);
        this.miniature.draw(context);
    }
}
class BigSaucerSmallPanelUIElement extends SmallPanelUIElement {
    constructor(position, visibility, observablePanel) {
        super(MainMenuBigSaucerImage.getInstance(), position, new BigSaucerMiniatureGameObject(), visibility);
        this.observablePanel = observablePanel
        this.observablePanel.registerObserver(this);
        this.started = false;
        this.ttl = 2;
    }

    subjectChanged(observable, property) {
        if (observable == this.observablePanel && property == "hide") {
            this.started = true;
            this.observablePanel.unregisterObserver(this);
        }
    }

    update(dt) {
        super.update(dt);
        if (this.started) {
            this.ttl -= dt;
            if (this.ttl < 0) {
                this.show();
                this.started = false;
            }
        }
    }
}
class RareoyArdeasSmallPanelUIElement extends SmallPanelUIElement {
    constructor(position, visibility, observablePanel) {
        super(MainMenuRareoyArdeasImage.getInstance(), position, new Player1ShipMiniatureGameObject(), visibility);
        this.observablePanel = observablePanel
        this.observablePanel.registerObserver(this);
        this.started = false;
        this.ttl = 3;
    }

    subjectChanged(observable, property) {
        if (observable == this.observablePanel && property == "show") {
            this.started = true;
            this.observablePanel.unregisterObserver(this);
        }
    }

    update(dt) {
        super.update(dt);
        if (this.started) {
            this.ttl -= dt;
            if (this.ttl < 0) {
                this.show();
                this.started = false;
            }
        }
    }
}
class TextUIElement extends UIElement{
    constructor(label, color, format) {
        super();
        this.label = label;
        this.color = color;
        this.format = format;
        this.size.x = ImageHandler.textLength(this.label, this.format);
    }
    
    draw(context) {
        if (this.visibility) {
            context.save();
            context.globalAlpha = this.getAlpha();;
            context.textBaseline = "top";
            context.fillStyle = this.color;
            context.font = this.format;
            context.fillText(this.label, this.position.x, this.position.y);
            context.restore();
        }
    } 
}

class ButtonUIElement extends UIElement {
    static size = new Vec2(321, 109);
    constructor(label, command) {
        super();
        this.command = command;
        this.sprite = new Sprite(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/button.png"));
        this.position = this.sprite.position;
        this.size = this.sprite.size;
        this.collideBox = new RectCollideBox(this.position, this.size);
        this.textUIElement = new TextUIElement(label, "black", "bold 24pt neuropol");
    }

    setAlpha(alpha) {
        this.sprite.globalAlpha = alpha;
        this.textUIElement.setAlpha(alpha);
    }

    getAlpha() {
        return this.sprite.globalAlpha;
    }

    update(dt) {
        this.textUIElement.position.x = this.position.x + (this.size.x - this.textUIElement.size.x) / 2;
        this.textUIElement.position.y = this.position.y + this.size.y * 0.3;

        let inputHandler = ServiceLocator.getService(ServiceLocator.KEYBOARD);
        if (inputHandler.isClicked() && Collider.isPointInRectangle(inputHandler.click, this.collideBox)) {
            this.command.execute();
        }
    }

    draw(context) {
        if (this.visibility) {
            this.sprite.draw(context);
            this.textUIElement.draw(context);
        }
    }    
}
