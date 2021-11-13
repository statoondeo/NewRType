class AssetLoader {
    static IMAGE = "IMAGE";
    static SOUND = "SOUND";

    constructor() {
        this.imagePathes = [];
        this.imageSources = [];

        this.soundPathes = [];
        this.soundSources = [];
        this.callBack = null;
        this.loadedAssetsCount = 0;
    }

    getLoadedRatio() {
        return this.getLoadedAssetsCount() / this.getTotalAssetsCount();
    }

    getTotalAssetsCount() {
        return this.imagePathes.length + this.soundPathes.length;
    }

    getLoadedAssetsCount() {
        return this.loadedAssetsCount;
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

    loadImage(path) {
        return new Promise(resolve => {
            // Chargement de l'image
            let image = new Image();
            image.onload = () => {
                // Lorsque c'est terminé on resout la promesse
                resolve(image);
            };
            image.src = path;
        }).then((image) => {
            // Lorsque le chargement est terminé, on stocke l'asset 
            // et on met à jour le compteur d'avancement
            this.imageSources[path] = image;
            this.assetLoaded();
        });
    }

    loadSound(path) {
        return new Promise(resolve => {
            // Charment du son
            let audio = new Audio();
            audio.preload = "auto";
            audio.autoplay = false;
            audio.oncanplay = () => {
                // Lorsque c'est terminé on resout la promesse
                resolve(audio);
            };
            audio.src = path;
        }).then((audio) => {
            // Lorsque le chargement est terminé, on stocke l'asset 
            // et on met à jour le compteur d'avancement
            this.soundSources[path] = audio;
            this.assetLoaded();
        });
    }

    loadSound2(path) {
        return new Promise(resolve => {
            fetch(path)
            .then(content => content.arrayBuffer())
            .then(buffer => Services.get(Services.AUDIO).decodeAudioData(buffer))
            .then(audioBuffer => {
                this.soundSources[path] = new Sound(audioBuffer);
                this.assetLoaded();
                resolve();
            });
        });
    }

    start(callBack) {
        this.callBack = callBack;

        // Liste des promesses (une par ressource à charger)
        // (Une promesse permet d'effectuer une tâche asynchrone)
        let assetPromises = []

        // Démarrage de la récupération des images
        this.imagePathes.forEach(path => {
            assetPromises.push(this.loadImage(path));
        });
        
        // Démarrage de la récupération des sons
        this.soundPathes.forEach(path => {
            assetPromises.push(this.loadSound2(path));
        });

        // On attend que toutes les promesses soient honorées
        Promise.all(assetPromises).then(() => {
            // On démarre le jeu
            this.callBack();
        });
    }

    assetLoaded() {
        this.loadedAssetsCount++;
    }
}
