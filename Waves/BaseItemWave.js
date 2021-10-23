class BaseItemWave extends Manager {
    constructor(ship, movePattern, startAt, appearPoint, spawnNumber, spawnSpeed) {
        super();
        this.ship = ship;
        this.movePattern = movePattern;
        this.startAt = startAt;
        this.appearPoint = appearPoint;
        this.spawnNumber = spawnNumber;
        this.spawnSpeed = spawnSpeed;
        this.spawnTime = this.spawnSpeed;
        this.started = false;
        this.ended = false;
        this.currentStep = 0;
    }

    spawn() {
        let newShip = this.ship.getClone();
        newShip.movePattern = this.movePattern.getClone();
        newShip.setPosition(this.appearPoint.getClone());
        this.addItem(newShip);
        this.spawnNumber--;
        this.spawnTime = this.spawnSpeed;
    }

    isStarted() {
        return this.started;
    }

    isEnded() {
        return this.ended;
    }

    update(dt) {
        if (!this.started && this.currentStep >= this.startAt) {
            this.started = true;
            this.spawn();
        }
        
        // Génération des sprites
        if (this.spawnNumber > 0) {
            this.spawnTime -= dt;
            if (this.spawnTime < 0) {

                // Sprite suivant
                this.spawn();
            }
        }

        // Update des sprites, et si des sprites sont sortis de l'écran, on les supprime
        let spritesToKill = [];
        this.items.forEach(sprite => {
            sprite.update(dt);
            let position = sprite.getPosition();
            let size = sprite.getSize();
            if (isOutOfScreen(position, size)) {
                spritesToKill.push(sprite);
            }                
        });

        // Suppression des sprites
        spritesToKill.forEach(sprite => {
            this.deleteItem(sprite);
        });

        // Si il n'y a plus de sprites en vie, alors la vague est terminée
        this.ended = this.spawnNumber == 0 && this.getLength() == 0;
    }

    draw(context) {
        if (this.started && !this.ended) {
            this.items.forEach(sprite => {
                sprite.draw(context);                
            });
        }
    }
}