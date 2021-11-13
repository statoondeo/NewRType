class Sound {
    constructor(audioBuffer) {
        this.audioBuffer = audioBuffer;
    }

    play() {
        let source = Services.get(Services.AUDIO).createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(Services.get(Services.AUDIO).destination);
        source.start();
        return source;
    }    
}