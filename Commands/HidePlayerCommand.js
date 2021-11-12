class HidePlayerCommand extends BaseCommand {
    constructor(playerShip) {
        super();
        this.playerShip = playerShip;
    }

    getClone() {
        return new HidePlayerCommand(this.playerShip);
    }

    execute() {
        if (this.canExecute) {
            this.playerShip.globalAlpha = 0;
            this.playerShip.moveStrategy = new DummyMoveStrategy();;
        }
    }
}
