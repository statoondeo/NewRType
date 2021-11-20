class SoundPool {
    constructor(sound, number) {
        this.sounds = [];
        this.index = 0;
        this.number = number;
        for (let index = 0; index < this.number; index++) {
            this.sounds.push(sound.cloneNode());
        }
    }

    play() {
        this.index = (this.index + 1) % this.number; 
        try {
            this.sounds[this.index].play();
        }
        catch(error) {}
    }    
}
