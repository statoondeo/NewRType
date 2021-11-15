class Player1ShipGameObject extends PlayerShipGameObject {
    constructor(initialPosition) {
        super(Services.get(Services.ASSET).get("Images/player1.png"), new Vec2(64), initialPosition)
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new MediumRedExplosionGameObject(100), new RedExplosionGameObject(75) ])));

        // Flash blanc lorsque l'on est touché
        let screen = Services.get(Services.SCREEN);
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, screen.width, screen.height);
        this.flashLayer = new FlashingLayer(canvas);
    }
                    
    getClone() {
        return new Player1ShipGameObject(initialPosition.getClone());
    }

    getName() {
        return "Rareoy Ardeas";
    }

    damage(amount) {
        super.damage(amount);
        this.flashLayer.show();
    }
}
class Player1ShipMiniatureGameObject extends AnimatedSprite {

    static size = new Vec2(64);

    constructor() {        
        let miniature = ImageHandler.zoomImage(Services.get(Services.ASSET).get("Images/player1.png"), new Vec2(1));
        super(miniature, Player1ShipMiniatureGameObject.size)
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}