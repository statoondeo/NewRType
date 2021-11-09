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

