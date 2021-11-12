// Background static, c'est à dire qui ne bouge pas avec le scrolling.
// Utilisé pour faire la couleur de fond des niveaux,
// ou pour afficher une image dans les scènes qui ne bougent pas (menu ou autre)
class ShootingStarLayer extends GameObject {
    constructor(layer) {
        super();
        this.partition = GameObjectPartition.NEUTRAL_PARTITION;
        this.layer = layer;
    }

    update(dt) {

    }
}

class ShootingStar extends Sprite {
    constructor() {
        let size = Math.random() * 10 + 5;
        let canvas = ImageHandler.createCanvas(size, size);
        let context = canvas.getContext("2d");
        let red = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let blue = Math.floor(Math.random() * 256);
        context.fillStyle = "rgb('" + red + "', '" + green + "', '" + blue + "')";
        context.beginPath();
        context.arc(Math.floor(size / 2), Math.floor(size / 2), Math.floor(size / 2), 0, 2 * Math.PI);
        context.fill();
        super(canvas);
        this.speed = Math.random() * 200 + 100;
        this.maxTtl = Math.random() * 2 + 1;
        this.ttl = this.maxTtl;
        this.angle = Math.random() * 2 * Math.PI;
        this.moveStrategy = new UniformMoveStrategy(this, new Vec2(Math.cos(this.angle), Math.sin(this.angle)));
    }

    update(dt) {
        this.ttl -= dt;
        if (this.ttl < 0) {
            this.status = GameObjectState.OUTDATED;
        }
        else {
            let 
        }
    }

    draw(context) {

    }
}