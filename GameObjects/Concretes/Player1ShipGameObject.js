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

    draw(context) {
        // On connect toutes les bullets dans un rayon déterminé
        context.save();
        context.strokeStyle = "#43CCFF";
        context.lineWidth = 1;
        context.globalAlpha = 0.2;
        let currentScene = Services.get(Services.SCENE).currentScene;
        currentScene.gameObjectsCollection.forEach(bullet => {
            if (bullet.type == GameObjectType.MISSILE && bullet.partition == this.partition && bullet.status == GameObjectState.ACTIVE) {
                let newCollideBox = new CircleCollideBox(new Vec2(bullet.position.x + bullet.size.x / 2 - 80, bullet.position.y + bullet.size.y / 2 - 80), 160);
                currentScene.quadTree.getCandidates(newCollideBox).forEach(otherBullet => {
                    if (bullet.type == otherBullet.type 
                        && bullet.partition == otherBullet.partition 
                        && otherBullet.status == GameObjectState.ACTIVE
                        && Tools.distance(newCollideBox.position, this.position) > 60
                        && newCollideBox.collide(otherBullet.collideBox)) {
                        // On trace un trait entre les 2 centres
                        context.beginPath();
                        context.moveTo(newCollideBox.position.x + newCollideBox.size.x / 2 - 80, newCollideBox.position.y + newCollideBox.size.y / 2 - 80);
                        context.lineTo(otherBullet.collideBox.position.x + otherBullet.collideBox.radius, otherBullet.collideBox.position.y + 1.5 * otherBullet.collideBox.radius);
                        context.stroke();
                    }
                });
            }            
        });        
        context.restore();
        super.draw(context);
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