class CamShake {
    constructor(playerShip) {
        this.playerShip = playerShip;
        this.shake = new Vec2();
        this.intensity = new Vec2(30, 20);
        this.maxTtl = 1;
        this.ttl = this.maxTtl;
        this.previousShake = new Vec2();
        this.finalShake = new Vec2();
    }
       
    update(dt) {
        // for (let index = 0; index < 10; index++) {
        //     console.log(index, Easing.easeOutCubic(index / 10));
        // }
        // this.ttl -= dt;
        // if (this.ttl < 0) {
        //     this.ttl = this.maxTtl;
        //     this.previousShake.x = this.shake.x;
        //     this.previousShake.y = this.shake.y;
        //     if (this.playerShip.moveStrategy != null) {
        //         this.shake.x = -this.playerShip.moveStrategy.vector.x * this.intensity.x;
        //         this.shake.y = -this.playerShip.moveStrategy.vector.y * this.intensity.y;
        //     }
        // }
        // let ratio = this.ttl / this.maxTtl;
        // this.finalShake.x = Easing.easeOutCubic(ratio) * (this.shake.x - this.previousShake.x) + this.shake.x;
        // this.finalShake.y = Easing.easeOutCubic(ratio) * (this.shake.y - this.previousShake.y) + this.shake.y;
    }

    getShake() {
        return this.finalShake;
    }
}

