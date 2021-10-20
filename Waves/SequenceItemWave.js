class SequenceItemWave {
    constructor(sprite, startAt, appearPoint, spawnSpeed, spawnNumber) {
        this.sprite = sprite;
        this.startAt = startAt;
        this.appearPoint = appearPoint;
        this.started = false;
        this.ended = false;
        this.spawnSpeed = spawnSpeed;
        this.spawnTime = this.spawnSpeed;
        this.spawnNumber = spawnNumber;
        this.sprites = [];
    }

    spawn() {
        let newSprite = this.sprite.getClone();
        newSprite.setPosition(this.appearPoint);
        this.sprites.push(newSprite);
        this.spawnNumber--;
        this.spawnTime = this.spawnSpeed;
    }

    deleteSprite(sprite) {
        let index = this.sprites.indexOf(sprite);
        this.sprites.splice(index, 1);    
    }

    update(dt, currentStep) {
        if (!this.started && currentStep >= this.startAt) {

            // Démarrage de la vague
            this.started = true;

            // Avec un 1er sprite
            this.spawn();
        }

        if (this.started) {

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
            this.sprites.forEach(sprite => {
                sprite.update(dt);
                let position = sprite.getPosition();
                let size = sprite.getSize();
                if (position.x + size.x < 0 || position.x > 321 || position.y < 0 || position.y + size.y > 201) {
                    spritesToKill.push(sprite);
                }                
            });

            // Suppression des sprites
            spritesToKill.forEach(sprite => {
                this.deleteSprite(sprite);
            });

            // Si il n'y a plus de sprites en vie, alors la vague est terminée
            this.ended = this.sprites.length == 0;

        }
    }

    draw(context) {
        if (this.started && !this.ended) {
            this.sprites.forEach(sprite => {
                sprite.draw(context);
            });
        }
    }
}