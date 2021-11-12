class Sound {
    constructor(soundPath) {
        this.soundPath = soundPath;
        this.sound = document.createElement("audio");
        this.sound.src = this.soundPath;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }
    
    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }
}