class BaseItemWave {
    constructor(screen, sprite, startAt, appearPoint, spawnNumber, spawnSpeed) {
        this.screen = screen;
        this.sprite = sprite;
        this.sprites = new Manager();
        this.startAt = startAt;
        this.appearPoint = appearPoint;
        this.spawnNumber = spawnNumber;
        this.spawnSpeed = spawnSpeed;
        this.spawnTime = this.spawnSpeed;
        this.started = false;
        this.ended = false;
    }

    spawn() {
        let newSprite = this.sprite.getClone();
        newSprite.setPosition(this.appearPoint.getClone());
        this.sprites.addItem(newSprite);
        this.spawnNumber--;
        this.spawnTime = this.spawnSpeed;
    }

    isStarted() {
        return this.started;
    }

    isEnded() {
        return this.ended;
    }

    update(dt, currentStep) {
        if (!this.started && currentStep >= this.startAt) {
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
        this.sprites.items.forEach(sprite => {
            sprite.update(dt);
            let position = sprite.getPosition();
            let size = sprite.getSize();
            if (isOutOfScreen(this.screen, position, size)) {
                spritesToKill.push(sprite);
            }                
        });

        // Suppression des sprites
        spritesToKill.forEach(sprite => {
            this.sprites.deleteItem(sprite);
        });

        // Si il n'y a plus de sprites en vie, alors la vague est terminée
        this.ended = this.spawnNumber == 0 && this.sprites.length == 0;
    }

    draw(context) {
        if (this.started && !this.ended) {
            this.sprites.items.forEach(sprite => {
                sprite.draw(context);                
            });
        }
    }
}