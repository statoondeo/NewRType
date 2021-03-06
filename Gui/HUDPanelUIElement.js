class BaseHUDPanelUIElement extends PanelUIElement {
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
            Services.get("ASSET").get("Images/Gui/playerHud.png"), new LifeBarGameObject(), 
            new Vec2(140, 50), new Vec2(-10, 10), new Vec2(200, 30), new Vec2(200, 150));
            this.speedBonus = 0;
            this.weaponBonus = 0;
            this.addWeaponBonus()
        }

    update(dt) {
        super.update(dt);
    }

    addSpeedBonus() {
        let miniature = new UIElementDecorator(new MiniSpeedUpGameObject());
        miniature.position = this.getNextSpeedBonusPosition();
        this.addElement(miniature);
        this.speedBonus++;
    }

    getNextSpeedBonusPosition() {
        return new Vec2(375 + (this.speedBonus + 1) * 30, 24)
    }

    addWeaponBonus() {
        if (this.weaponBonus < 5) {
            this.weaponBonus++;
            let miniature = new UIElementDecorator(new MiniWeaponUpGameObject());
            miniature.position = this.getNextWeaponBonusPosition();
            this.addElement(miniature);
        }
    }

    getNextWeaponBonusPosition() {
        return new Vec2(275 + (this.weaponBonus + 1) * 30, 144)
    }
}
class RedHUDPanelUIElement extends BaseHUDPanelUIElement {
    constructor(playerShip, position, visibility) {
        super(playerShip, position, visibility, Services.get("ASSET").get("Images/Gui/playerHud2.png"), new RedLifeBarGameObject(),
        new Vec2(Services.get("SCREEN").width - 598 - 210 - 472, 50), new Vec2(30, 10), new Vec2(200, 30), new Vec2(200, 150));
    }
}

