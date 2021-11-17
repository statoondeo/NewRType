class PlaySoundCommand extends BaseCommand {
    constructor(sound) {
        super(null);
        this.sound = sound;
    }

    getClone() {
        return new PlaySoundCommand(this.sound);
    }

    execute() {
        if (this.canExecute) {
            this.sound.play();
        }
    }
}
