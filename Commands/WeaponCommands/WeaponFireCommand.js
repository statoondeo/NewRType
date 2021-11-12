class WeaponFireCommand extends BaseCommand {
    constructor(gameObject, weapon) {
        super(gameObject);
        this.weapon = weapon;
    }

    getName() {
        return this.weapon.getName();
    }

    update(dt) {
        this.weapon.update(dt);
    }

    execute() {
        this.weapon.fire();
    }
}

