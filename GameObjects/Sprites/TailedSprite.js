class TailedSprite extends GameObject {
    constructor(headSprite, bodySprite, tailSprite, nbBody) {
        super();
        this.headSprite = headSprite;
        this.bodySprite = bodySprite;
        this.tailSprite = tailSprite;
        this.nbBody = nbBody;
        this.currentNbBody = 0;
        this.bodySprites = [];
        this.momentumTtl = 0.1;
        this.ttl = this.momentumTtl;
    }

    getClone() {
        return new TailedSprite(this.headSprite, this.bodySprite, this.tailSprite, this.nbBody, this.speed);
    }

    update(dt) {
        super.update(dt);
        this.ttl -= dt;
        if (this.ttl <= 0) {
            this.ttl = this.momentumTtl;
            if (this.currentNbBody < this.nbBody) {
                this.bodySprites.push(this.bodySprite.getClone());
                this.currentNbBody++;
            }
            if (this.currentNbBody != 0) {
                this.tailSprite.position.x = this.bodySprites[this.currentNbBody - 1].position.x;
                this.tailSprite.position.y = this.bodySprites[this.currentNbBody - 1].position.y;
                for (let index = this.currentNbBody - 1; index > 0; index--) {
                    this.bodySprites[index].position.x = this.bodySprites[index - 1].position.x;
                    this.bodySprites[index].position.y = this.bodySprites[index - 1].position.y;
                }        
                this.bodySprites[0].position.x = this.headSprite.position.x;
                this.bodySprites[0].position.y = this.headSprite.position.y;
            }
        }
        this.tailSprite.update(dt);
        for (let index = this.currentNbBody - 1; index > 0; index--) {
            this.bodySprites[index].update(dt);
        } 
        this.headSprite.update(dt);
        this.headSprite.position.x = this.position.x;
        this.headSprite.position.y = this.position.y;
    }

    draw(context) {
        if (ServiceLocator.getService(ServiceLocator.PARAMETER).colliderDisplay) {
            this.collideBox.draw(context);
        }
        else {
            this.tailSprite.draw(context);
            for (let index = 0; index < this.currentNbBody; index++) {
                this.bodySprites[index].draw(context);
            }
            this.headSprite.draw(context);
        }
    }
}