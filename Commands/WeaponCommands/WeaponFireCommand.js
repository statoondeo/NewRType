class WeaponFireCommand extends BaseCommand {
    constructor(gameObject, weapon) {
        super(gameObject);
        this.weapon = weapon;
    }

    update(dt) {
        this.weapon.update(dt);
    }

    execute() {
        this.weapon.fire();
    }
}

