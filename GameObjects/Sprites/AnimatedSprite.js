class AnimatedSprite extends GameObject {
    constructor(image, tileSheet) {
        super();

        // Pour la gestion des spriteSheet
        this.image = image;
        this.currentFrame = 0;
        this.size = tileSheet;
        this.tile = new Vec2();
        this.getNewFrame();

        // Gestion des animations
        this.animations = [];
        this.currentAnimation = null;
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
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.globalAlpha;
        context.drawImage(
            this.image, 
            Math.floor(this.tile.x), 
            Math.floor(this.tile.y), 
            Math.floor(this.size.x), 
            Math.floor(this.size.y), 
            Math.floor(this.position.x), 
            Math.floor(this.position.y), 
            Math.floor(this.size.x), 
            Math.floor(this.size.y));
        context.restore();
        if (Services.get(Services.PARAMETER).colliderDisplay) {
            this.collideBox.draw(context);
        }    
    }
}