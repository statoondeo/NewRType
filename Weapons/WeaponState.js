class WeaponState {
    constructor(name, fireCommand, level) {
        this.fireCommand = fireCommand;
        this.previousWeaponState = this.nextWeaponState = null;
        this.name = name;
        this.level = level;
    }

    getName() {
        return this.name + " - Level " + this.level;
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
