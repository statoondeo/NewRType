class Weapon {
    constructor(playerShip, initialWeaponState) {
        this.playerShip = playerShip;
        this.currentWeaponState = initialWeaponState;
    }

    getName() {
        return this.currentWeaponState.getName();
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

