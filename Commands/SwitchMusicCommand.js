class SwitchMusicCommand extends BaseCommand {
    constructor(scene, music) {
        super(null);
        this.scene = scene;
        this.music = music;
        this.music.loop = true;
    }

    getClone() {
        return new SwitchMusicCommand(this.scene, this.music);
    }

    execute() {
        if (this.canExecute) {
            this.scene.music.pause();
            this.scene.music = this.music;
            this.scene.music.play();
        }
    }
}
