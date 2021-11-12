class HidePanelCommand extends BaseCommand {
    constructor(panel) {
        super();
        this.panel = panel;
    }

    getClone() {
        return new ShowPanelCommand(this.panel);
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.panel.hide();
        }
    }
}
