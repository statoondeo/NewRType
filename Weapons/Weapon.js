class BulletWeaponFactory {
    static getBulletWeapon(playerShip) {
        // Instanciation des etats
        let level1State = new WeaponState(new Level1BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), 0.4), 1);
        // let level1State = new WeaponState(new Level1RocketFireCommand(playerShip, new WhiteRocketGameObject(playerShip.partition, new Vec2(1, 0)), new Vec2(0, -16), 0.4), 1);
        let level2State = new WeaponState(new Level2BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), 0.4), 2);
        let level3State = new WeaponState(new Level3BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), 0.4), 3);
        let level4State = new WeaponState(new Level4BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), 0.4), 4);
        let level5State = new WeaponState(new Level5BulletFireCommand(playerShip, new BlueBulletGameObject(playerShip.partition, new Vec2(1, 0)), 0.4), 5);

        // Liaisons entre les états
        level1State.previousWeaponState = level1State;
        level1State.nextWeaponState = level2State;

        level2State.previousWeaponState = level1State;
        level2State.nextWeaponState = level3State;

        level3State.previousWeaponState = level2State;
        level3State.nextWeaponState = level4State;

        level4State.previousWeaponState = level3State;
        level4State.nextWeaponState = level5State;

        level5State.previousWeaponState = level4State;
        level5State.nextWeaponState = level5State;

        return new Weapon(playerShip, level1State);
    }
}

class Weapon {
    constructor(playerShip, initialWeaponState) {
        this.playerSHip = playerShip;
        this.currentWeaponState = initialWeaponState;
    }

    update(dt) {
        this.currentWeaponState.update(dt);
    }

    currentLevel() {
        return this.currentWeaponState.currentLevel();
    }

    levelDown() {
        this.currentWeaponState = this.currentWeaponState.levelDown();
    }

    levelUp() {
        this.currentWeaponState = this.currentWeaponState.levelUp();
    }

    fire() {
        this.currentWeaponState.fire();
    }
}

class WeaponState {
    constructor(fireCommand, level) {
        this.fireCommand = fireCommand;
        this.previousWeaponState = this.nextWeaponState = null;
        this.level = level;
    }

    currentLevel() {
        return this.level;
    }

    update(dt) {
        this.fireCommand.update(dt);
    }

    levelDown() {
        return this.previousWeaponState;
    }

    levelUp() {
        return this.nextWeaponState;
    }

    fire() {
        this.fireCommand.execute();
    }
}
