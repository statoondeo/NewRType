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
