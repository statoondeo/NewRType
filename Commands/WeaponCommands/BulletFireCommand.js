class BaseMultiBulletFireCommand extends BaseCommand {
    constructor(gameObject, bulletPrototype, fireRate) {
        super(gameObject);
        this.bulletPrototype = bulletPrototype;
        this.fireRateTtl = this.fireRate = fireRate;
        this.frontAngle = Math.PI / 6;        
        this.rearAngle = Math.PI / 12;        
        this.fireCommands = []
    }
    
    update(dt) {
        this.fireCommands.forEach(fireCommand => {
            fireCommand.update(dt);
        });
    }

    execute() {
        this.fireCommands.forEach(fireCommand => {
            fireCommand.execute();
        });
    }
}
class Level1BulletFireCommand extends BaseMultiBulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized) {
        super(gameObject, bulletPrototype, fireRate);
        this.fireCommands.push(new FireRatedFireCommand(this.gameObject, this.bulletPrototype, new Vec2(), this.fireRate, randomized));
    }

    getClone(gameObject) {
        return new Level1BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate);
    }
}
class Level2BulletFireCommand extends Level1BulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized) {
        super(gameObject, bulletPrototype, fireRate, randomized);

        let startingPoint = new Vec2(this.gameObject.size.x, (this.gameObject.size.y - this.bulletPrototype.size.y) / 2);
        let otherBulletPrototype = bulletPrototype.getClone();

        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(-this.frontAngle), Math.sin(-this.frontAngle)));
        this.fireCommands.push(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));

        otherBulletPrototype = bulletPrototype.getClone();
        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(this.frontAngle), Math.sin(this.frontAngle)));
        this.fireCommands.push(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));
    }

    getClone(gameObject) {
        return new Level2BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate);
    }
}
class Level3BulletFireCommand extends Level2BulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized) {
        super(gameObject, bulletPrototype, fireRate, randomized);

        let startingPoint = new Vec2(-this.bulletPrototype.size.x, (this.gameObject.size.y - this.bulletPrototype.size.y) / 2);
        let otherBulletPrototype = bulletPrototype.getClone();

        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(Math.PI - this.rearAngle), Math.sin(Math.PI - this.rearAngle)));
        this.fireCommands.push(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));

        otherBulletPrototype = bulletPrototype.getClone();
        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(Math.PI + this.rearAngle), Math.sin(Math.PI + this.rearAngle)));
        this.fireCommands.push(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));
    }

    getClone(gameObject) {
        return new Level3BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate);
    }
}
class Level4BulletFireCommand extends Level3BulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized) {
        super(gameObject, bulletPrototype, fireRate, randomized);
        this.fireCommands.push(new FireRatedFireCommand(gameObject, bulletPrototype, new Vec2(this.gameObject.size.x, (this.gameObject.size.y - 2 * this.bulletPrototype.size.y) / 2), fireRate, randomized));
        this.fireCommands.push(new FireRatedFireCommand(gameObject, bulletPrototype, new Vec2(this.gameObject.size.x, this.gameObject.size.y / 2), fireRate, randomized));
    }

    getClone(gameObject) {
        return new Level4BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate);
    }
}
class Level5BulletFireCommand extends Level4BulletFireCommand {
    constructor(gameObject, bulletPrototype, fireRate, randomized) {
        super(gameObject, bulletPrototype, fireRate, randomized);
        let startingPoint = new Vec2(this.gameObject.size.x - this.bulletPrototype.size.x, (this.gameObject.size.y - this.bulletPrototype.size.y) / 2);

        let otherBulletPrototype = bulletPrototype.getClone();
        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(-this.frontAngle), Math.sin(-this.frontAngle)));
        this.fireCommands.push(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));

        otherBulletPrototype = bulletPrototype.getClone();
        otherBulletPrototype.moveStrategy = new UniformMoveStrategy(otherBulletPrototype, new Vec2(Math.cos(this.frontAngle), Math.sin(this.frontAngle)));
        this.fireCommands.push(new FireRatedFireCommand(gameObject, otherBulletPrototype, startingPoint, fireRate, randomized));    
    }

    getClone(gameObject) {
        return new Level5BulletFireCommand(gameObject, this.bulletPrototype.getClone(), this.fireRate);
    }
}

