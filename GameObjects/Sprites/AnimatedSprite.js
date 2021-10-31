class AnimatedSprite extends GameObject {
    constructor(image, tileSheet) {
        super();

        // Pour la gestion des spriteSheet
        this.image = image;
        this.currentFrame = 0;
        this.originalSize = tileSheet;
        this.size = tileSheet.getClone();
        this.tile = new Vec2();
        this.getNewFrame();

        // Gestion des animations
        this.animations = [];
        this.currentAnimation = null;
    }

    getClone() {
        let clone = new AnimatedSprite(this.image, this.size.getClone());
        clone.partition = this.partition;
        clone.position = this.position.getClone();
        clone.originalSize = this.originalSize.getClone();
        clone.scale = this.scale.getClone();
        clone.moveCommand = this.moveCommand.getClone();
        clone.fireCommand = this.fireCommand.getClone();
        clone.speed = this.speed;
        clone.collideBox = this.collideBox.getClone();
        clone.collideBox.position = clone.position;
        clone.image = this.image;
        clone.currentFrame = this.currentFrame;
        clone.tile = this.tile.getClone();
        clone.animations = [];
        this.animations.forEach(animation => {
            clone.animations.push(animation.getClone());
        });
        let index = this.currentAnimation == null ? -1 : this.animations.indexOf(this.currentAnimation);
        clone.currentAnimation = index == -1 ? null : clone.animations[index];

        return clone;
    }

    getNewFrame() {
        // On récupère la nouvelle frame de l'animation
        this.tile.x = this.currentFrame % (this.image.width / this.size.x) * this.size.x;
        this.tile.y = Math.floor(this.currentFrame / (this.image.width / this.size.x)) * this.size.y;
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    startAnimation(name, frame) {
        // Si l'animation est déjà en cours, on ne la relance pas!
        if (this.currentAnimation != null && this.currentAnimation.name == name && this.currentAnimation.started) return; 

        // On cherche l'animation demandée et on la démarre
        this.animations.forEach(animation => {
            if (animation.name == name) {
                this.currentAnimation = animation;
                this.currentAnimation.start(frame);
            }            
        });
    }

    update(dt) {
        super.update(dt);
        if (this.currentAnimation != null && this.currentAnimation.started) {
            // On avance dans l'animation
            this.currentAnimation.update(dt);
            this.currentFrame = this.currentAnimation.getCurrentFrame();

            // On récupère la nouvelle frame de l'animation
            this.getNewFrame();
        }

        if (Tools.isOutOfScreen(this.position, this.size)) {
            this.status = GameObject.OUTDATED;
        }
    }

    draw(context) {
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            this.collideBox.draw(context);
        }
        else {
            context.save();
            context.globalAlpha = this.alpha;
            context.drawImage(
                this.image, 
                this.tile.x, 
                this.tile.y, 
                this.size.x, 
                this.size.y, 
                Math.floor(this.position.x), 
                Math.floor(this.position.y), 
                this.size.x * this.scale.x, 
                this.size.y * this.scale.y);
            context.restore();
        }
    }
}