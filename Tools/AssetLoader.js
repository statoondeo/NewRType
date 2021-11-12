class AssetLoader {
    static IMAGE = "IMAGE";
    static SOUND = "SOUND";

    constructor() {
        this.imagePathes = [];
        this.imageSources = [];

        this.soundPathes = [];
        this.soundSources = [];
        this.callBack = null;
        this.loadedImagesCount = 0;
    }

    getLoadedRatio() {
        return this.getLoadedImagesCount() / this.getTotalImagesCount();
    }

    getTotalImagesCount() {
        return this.imagePathes.length;
    }

    getLoadedImagesCount() {
        return this.loadedImagesCount;
    }

    add(type, assetPath) {
        if (type == AssetLoader.IMAGE) {
            this.imagePathes.push(assetPath);
        } else if (type == AssetLoader.SOUND) {
            this.soundPathes.push(assetPath);
        }
    }

    getImages() {
        return this.imageSources;
    }

    getImage(imagePath) {
        return this.imageSources[imagePath];
    }
    
    getSound(soundPath) {
        return this.soundSources[soundPath];
    }

    start(callBack) {
        this.callBack = callBack;

        // Démarrage de la récupération des images
        this.imagePathes.forEach(path => {
            let image = new Image();
            image.onload = this.imageLoaded.bind(this);
            image.src = path;
            this.imageSources[path] = image;
        });

        // Traitements des sons
        this.soundPathes.forEach(sound => {
            this.soundSources[sound] = new Sound(sound);
        });
    }

    imageLoaded(e) {
        this.loadedImagesCount++;
        if (this.getTotalImagesCount() == this.getLoadedImagesCount()) {
            this.callBack();
        }
    }
}