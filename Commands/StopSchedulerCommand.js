class StopSchedulerCommand extends BaseCommand {
    constructor(gameObject, scheduler) {
        super(gameObject);
        this.scheduler = scheduler;
    }

    getClone(gameObject) {
        return new StopSchedulerCommand(gameObject, this.scheduler);
    }

    execute() {
        if (this.canExecute) {
            this.scheduler.speed = 0;
        }
    }
}
