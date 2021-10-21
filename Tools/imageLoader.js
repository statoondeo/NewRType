class ImageLoader {

    constructor() {
        this.imagePathes = [];
        this.imageSources = [];
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

    add(imagePath) {
        this.imagePathes.push(imagePath);
    }

    getImages() {
        return this.imageSources;
    }

    getImage(imagePath) {
        return this.imageSources[imagePath];
    }

    start(callBack) {
        this.callBack = callBack;
        this.imagePathes.forEach(path => {
            let image = new Image();
            image.onload = this.imageLoaded.bind(this);
            image.src = path;
            this.imageSources[path] = image;
        });
    }

    imageLoaded(e) {
        this.loadedImagesCount++;
        if (this.getTotalImagesCount() == this.getLoadedImagesCount()) {
            this.callBack();
        }
    }
}