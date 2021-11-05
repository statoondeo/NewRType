class PlayerAimedFireCommand extends BaseCommand {
    constructor(command) {
        super();
        this.command = command;
    }

    getClone(gameObject) {
        return new PlayerAimedFireCommand(this.command.getClone(gameObject));
    }

    update(dt) {
        this.command.update(dt);
    }

    execute() {
        this.command.execute();
        if (this.command.lastBullet != null) {
            let playerShip = ServiceLocator.getService(ServiceLocator.SCENE).currentScene.playerShip;
            let fireAngle = Math.atan2(playerShip.position.y - this.command.lastBullet.position.y, playerShip.position.x - this.command.lastBullet.position.x);
            this.command.lastBullet.behaveStrategy.moveStrategy.initialVector.x = Math.cos(fireAngle);
            this.command.lastBullet.behaveStrategy.moveStrategy.initialVector.y = Math.sin(fireAngle);        }
    }
}
