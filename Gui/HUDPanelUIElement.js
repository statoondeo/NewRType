class BaseHUDPanelUIElement extends PanelUIElement {
    static size = new Vec2(598, 177);
    constructor(playerShip, position, visibility, backgroundVisual, lifeBar, lifeOffset, backgroundOffset, titleOffset, weaponOffset) {
        super(position, visibility);
        this.playerShip = playerShip;

        let background = new SpriteUIElement(backgroundVisual);
        background.position.x = backgroundOffset.x;
        background.position.y = backgroundOffset.y;
        this.addElement(background);

        this.lifeBar = lifeBar;
        this.lifeBarUIElement = new UIElementDecorator(this.lifeBar) 
        this.lifeBarUIElement.position.x = lifeOffset.x;
        this.lifeBarUIElement.position.y = lifeOffset.y;
        this.addElement(this.lifeBarUIElement);

        let text = new TextUIElement(playerShip.getName(), "white", "12pt neuropol");
        text.position.x = titleOffset.x;
        text.position.y = titleOffset.y;
        this.addElement(text);

        this.weaponText = null;
        if (this.playerShip.fireCommand.weapon != null) {
            this.weaponText = new TextUIElement(this.playerShip.fireCommand.weapon.getName(), "silver", "12pt neuropol");
            this.weaponText.position.x = weaponOffset.x;
            this.weaponText.position.y = weaponOffset.y;
            this.addElement(this.weaponText);
        }
    }

    update(dt) {
        super.update(dt);
        this.lifeBar.setRatio(this.playerShip.life / this.playerShip.maxLife);
        if (null != this.weaponText) {
            this.weaponText.label = this.playerShip.fireCommand.weapon.getName();
        }
    }
}
class HUDPanelUIElement extends BaseHUDPanelUIElement {
    constructor(playerShip, position, visibility) {
        super(playerShip, position, visibility, 
            Services.get(Services.ASSET).get("Images/Gui/playerHud.png"), new LifeBarGameObject(), 
            new Vec2(140, 50), new Vec2(-10, 10), new Vec2(200, 30), new Vec2(200, 150));
    }
}
class RedHUDPanelUIElement extends BaseHUDPanelUIElement {
    constructor(playerShip, position, visibility) {
        super(playerShip, position, visibility, Services.get(Services.ASSET).get("Images/Gui/playerHud2.png"), new RedLifeBarGameObject(),
        new Vec2(Services.get(Services.SCREEN).width - BaseHUDPanelUIElement.size.x - 210 - BaseLifeBarGameObject.size.x, 50), new Vec2(30, 10), new Vec2(200, 30), new Vec2(200, 150));
    }
}

