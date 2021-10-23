class Sprite {
    constructor(image, initialPosition = new Vec2()) {
        this.image = image;
        this.position = initialPosition;

        // Pour la gestion des spriteSheet
        this.currentFrame = 0;
        this.spriteSheet = false;
        this.size = this.image == null ? new Vec2() : new Vec2(this.image.width, this.image.height);

        // Gestion du zoom
        this.scale = new Vec2(1, 1);

        // Gestion des animations
        this.animations = [];
        this.currentAnimation = null;
    }

    getClone() {
        let newSprite = new Sprite(this.image, this.position.getClone());
        newSprite.currentFrame = this.currentFrame;
        newSprite.spriteSheet = this.spriteSheet;
        newSprite.size = this.size.getClone();
        newSprite.scale = this.scale.getClone();
        newSprite.animations = [];
        this.animations.forEach(animation => {
            newSprite.animations.push(animation.getClone());
        });
        let index = this.currentAnimation == null ? -1 : this.animations.indexOf(this.currentAnimation);
        newSprite.currentAnimation = index == -1 ? null : newSprite.animations[index];
        return newSprite;
    }

    setPosition(position) {
        this.position = position;
    }

    getPosition() {
        return this.position.getClone();
    }

    getSize() {
        return this.size.getClone();
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    startAnimation(name) {
        // Si l'animation est déjà en cours, on ne la relance pas!
        if (this.currentAnimation != null && this.currentAnimation.name == name && this.currentAnimation.started) return; 

        // On cherche l'animation demandée et on la démarre
        this.animations.forEach(animation => {
            if (animation.name == name) {
                this.currentAnimation = animation;
                this.currentAnimation.start();
            }            
        });
    }

    setTileSheet(size) {
        this.spriteSheet = true;
        this.size = size;
    }

    setScale(scale = new Vec2(1, 1)) {
        this.scale = scale;
    }

    update(dt) {
        if (this.currentAnimation != null && this.currentAnimation.started) {
            this.currentAnimation.update(dt);
            this.currentFrame = this.currentAnimation.getCurrentFrame();
        }
    }

    draw(context) {
        if (this.spriteSheet) {
            let x = this.currentFrame % (this.image.width / this.size.x) * this.size.x;
            let y = Math.floor(this.currentFrame / (this.image.width / this.size.x)) * this.size.y;
            context.drawImage(
                this.image, 
                x, y, this.size.x, this.size.y, 
                this.position.x, this.position.y, this.size.x * this.scale.x, this.size.y * this.scale.y);
        }
        else {
            context.drawImage(this.image, this.position.x, this.position.y, this.size.x * this.scale.x, this.size.y * this.scale.y);
        }
    }
}