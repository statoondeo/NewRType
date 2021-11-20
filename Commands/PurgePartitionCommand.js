class PurgePartitionCommand extends BaseCommand {
    constructor(partition) {
        super();
        this.partition = partition;
    }

    getClone() {
        return new PurgePartitionCommand(this.partition);
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.partition.forEach(gameObject => {
                gameObject.status = "OUTDATED";
            });
        }
    }
}
