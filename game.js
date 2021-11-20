let canvasInPage = document.getElementById("canvas");
let drawContext = canvasInPage.getContext("2d")
let interval;
let lastTick = 0;
let fps = 0;
let fpsTolerance = 1 / 1000;
let wantedFps = 60;
let fpsList = [ 0, 0, 0, 0, 0];
let fpsIndex = 0;

// Classe permettant de conserver l'état des touches d'une frame à l'autre
// dans un tableau associatif pour eviter de déclarer des variables en serie!
// TODO : Gérer un masque pour se limiter à certaines touches?
class InputListener {
    constructor() {
        // On conserve les états des touches du clavier
        // Etat courant
        this.keyStates = [];

        // Etat précédent
        this.keyOldStates = [];

        // Commandes du joueur
        this.boundedCommands = [];

        // Coordonnées de la souris
        this.mouse = new Vec2();

        // Gestion du click
        this.click = false;
    }

    registerCommand(control, command) {
        this.boundedCommands[control] = command;
    }

    unregisterCommand(command) {
        let index = this.boundedCommands.indexOf(command);
        if (index >= 0) {
            this.boundedCommands.splice(index, 1);
        }
    }

    clearCommands() {
        this.boundedCommands = [];
    }

    mouseMove(mouseX, mouseY) {
        this.mouse.x = mouseX;
        this.mouse.y = mouseY;
    }

    mouseDown() {
        this.click = true;
    }
    
    mouseUp() {
        this.click = false;
    }

    // Gestion des contrôles utilisés par le joueur pour cette frame
    handleInput() {
        let commandsList = [];

        for (let item in this.boundedCommands) {
            if (this.isDown(item)) {
                commandsList.push(this.boundedCommands[item]);
            }
        }
        
        return commandsList;
    }

    // Est-ce que la touche était enfoncée lors de la frame précédente
    isPreviouslyDown(key) {
        return this.keyOldStates[key] == null ? false : this.keyOldStates[key];
    }

    // Une touche est enfoncée, on bascule son switch
    switchOn(key) {
        this.keyOldStates[key] = this.keyStates[key];
        this.keyStates[key] = true;
    }
    
    // Une touche est relachée on bascule son switch dans l'autre sens
    switchOff(key) {
        this.keyOldStates[key] = this.keyStates[key];
        this.keyStates[key] = false;
    }

    // Fonctions à utiliser pour connaitre l'état du clavier
    // pour se rapprocher  de ce que propose love2D
    
    // Est-ce que la touche est enfoncée?
    isDown(key) {
        return this.keyStates[key] == null ? false : this.keyStates[key];
    }
    
    // Est-ce que la touche vient d'être enfoncée?
    isPressed(key) {
        return this.isDown(key) && !this.isPreviouslyDown(key);
    }

    // Est-ce que la souris a été clickée
    isClicked() {
        return this.click;
    }
}

class CamShake {
    constructor(playerShip) {
        this.playerShip = playerShip;
        this.shake = new Vec2();
        this.intensity = new Vec2(30, 20);
        this.maxTtl = 1;
        this.ttl = this.maxTtl;
        this.previousShake = new Vec2();
        this.finalShake = new Vec2();
    }
       
    update(dt) {
        // for (let index = 0; index < 10; index++) {
        //     console.log(index, Easing.easeOutCubic(index / 10));
        // }
        // this.ttl -= dt;
        // if (this.ttl < 0) {
        //     this.ttl = this.maxTtl;
        //     this.previousShake.x = this.shake.x;
        //     this.previousShake.y = this.shake.y;
        //     if (this.playerShip.moveStrategy != null) {
        //         this.shake.x = -this.playerShip.moveStrategy.vector.x * this.intensity.x;
        //         this.shake.y = -this.playerShip.moveStrategy.vector.y * this.intensity.y;
        //     }
        // }
        // let ratio = this.ttl / this.maxTtl;
        // this.finalShake.x = Easing.easeOutCubic(ratio) * (this.shake.x - this.previousShake.x) + this.shake.x;
        // this.finalShake.y = Easing.easeOutCubic(ratio) * (this.shake.y - this.previousShake.y) + this.shake.y;
    }

    getShake() {
        return this.finalShake;
    }
}

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
class AssetLoader {
    // static IMAGE = "IMAGE";
    // static SOUND = "SOUND";

    constructor() {
        this.assetPathes = [];
        this.assetSources = [];
        this.callBack = null;
        this.loadedAssetsCount = 0;
    }

    getLoadedRatio() {
        return this.getLoadedAssetsCount() / this.getTotalAssetsCount();
    }

    getTotalAssetsCount() {
        return this.assetPathes.length;
    }

    getLoadedAssetsCount() {
        return this.loadedAssetsCount;
    }

    add(type, assetPath) {
        this.assetPathes.push({ type : type, path : assetPath });
    }

    get(path) {
        return this.assetSources[path];
    }

    loadImage(path) {
        return new Promise((success, error) => {
            // Chargement de l'image
            let image = new Image();
            image.onload = () => {
                // Lorsque c'est terminé on resout la promesse
                success(image);
            };
            image.src = path;
        }).then((image) => {
            // Lorsque le chargement est terminé, on stocke l'asset 
            // et on met à jour le compteur d'avancement
            this.assetSources[path] = image;
            this.assetLoaded();
        });
    }
    
    loadSoundFailure() {

    }

    loadSound(path) {
        return new Promise((success, loadSoundFailure) => {
            // Chargement de l'image
            let audio = new Audio();
            audio.oncanplaythrough = () => {
                // Lorsque c'est terminé on resout la promesse
                success(audio);
            };
            audio.src = path;
        }).then((audio) => {
            // Lorsque le chargement est terminé, on stocke l'asset 
            // et on met à jour le compteur d'avancement
            this.assetSources[path] = audio;
            this.assetLoaded();
        });
    }

    start(callBack) {
        this.callBack = callBack;

        // Liste des promesses (une par ressource à charger)
        // (Une promesse permet d'effectuer une tâche asynchrone)
        let assetPromises = []

        // Démarrage de la récupération des assets
        this.assetPathes.forEach(asset => {
            if (asset.type == "IMAGE") {
                assetPromises.push(this.loadImage(asset.path));
            }
            else if (asset.type == "SOUND") {
                assetPromises.push(this.loadSound(asset.path));
            }
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
class Easing {
    static easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    static easeOutCubic(x) {
        return 1 - (1 - x) ** 3;
    }

    static easeInOutCubic(x) {
        return x < 0.5 ? 4 * x ** 3 : 1 - ((-2 * x + 2) ** 3) / 2;
    }
}

class Manager {
    constructor() {
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    deleteItem(item) {
        let index = this.items.indexOf(item);
        if (index != -1) {
            this.items.splice(index, 1);
        }
    }

    getItem(index) {
        return this.items[index];
    }

    getLength() {
        return this.items.length;
    }
}
class ServicesLocator {
    // static SCREEN = 0;
    // static ASSET = 1;
    // static INPUT = 2;
    // static SCENE = 3;
    // static PARAMETER = 4;
    // static AUDIO = 5;

    constructor() {
        this.services = [];
    }

    register(serviceType, service) {
        this.services[serviceType] = service;
    }

    get(serviceType) {
        return this.services[serviceType];
    }   
}

class Tools {
    static isOutOfScreen(position, size) {
        let screen = Services.get("SCREEN");
        return position.x + size.x < 0 || position.x > screen.width || position.y + size.y < 0 || position.y > screen.height
    }

    static distance(pointA, pointB) {
        return ((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2) ** 0.5;
    }

    static normalize(vector) {
        // Normalisation du vecteur
        let normalization = (vector.x ** 2 + vector.y ** 2) ** 0.5;
        if (normalization != 0) {
            vector.x = vector.x / normalization;
            vector.y = vector.y / normalization;
        }
        return vector;
    }  

    static clamp(value, min, max) {
        return Math.max(Math.min(value, max), min);
    }

    static lerp(minBound, maxBound, ratio) {
        return minBound * (1 - ratio) + maxBound * ratio;
    }
}

class Vec2 {
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }

    getClone() {
        return new Vec2(this.x, this.y);
    }
}

class ImageHandler {
    constructor(maxSize, drawingDirection = new Vec2(1)) {
        // Liste des images à assembler
        this.images = [];
        this.maxSize = maxSize;
        this.drawingZoom = drawingDirection;
        this.drawingDirection = drawingDirection.getClone();
        this.drawingDirection.x /= Math.abs(this.drawingDirection.x);
        this.drawingDirection.y /= Math.abs(this.drawingDirection.y);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.maxSize.x;
        this.canvas.height = this.maxSize.y;
        this.canvasContext = this.canvas.getContext("2d");
    }
    
    static createCanvas(width, height) {
        let newCanvas = document.createElement('canvas');
        newCanvas.width = width;
        newCanvas.height = height;
        return newCanvas;
    }

    static zoomImage(image, zoom = new Vec2(1)) {
        let newCanvas = ImageHandler.createCanvas(image.width * zoom.x, image.height * zoom.y);
        let context = newCanvas.getContext("2d");

        context.save();
        context.scale(zoom.x, zoom.y);
        context.drawImage(image, 0, 0);
        context.restore();

        return newCanvas;
    }
    static textLength(text, format) {
        let newCanvas = ImageHandler.createCanvas(1280, 800);
        let context = newCanvas.getContext("2d");
        context.save();
        context.font = format;
        let length = context.measureText(text).width;
        context.restore();
        return length;
    }

    static flipImage(image, flip = new Vec2(1)) {
        let newCanvas = ImageHandler.createCanvas(image.width, image.height);
        let context = newCanvas.getContext("2d");

        flip.x = flip.x / Math.abs(flip.x);
        flip.y = flip.y / Math.abs(flip.y);

        context.save();
        context.translate(flip.x == -1 ? image.width : 0, flip.y == -1 ? image.height : 0);
        context.scale(flip.x, flip.y);
        context.drawImage(image, 0, 0);
        context.restore();

        return newCanvas;
    }

    // On ajoute des images à dessiner
    addImage(image, position = new Vec2()) {
        this.images.push({ imageSource : image, imagePosition : position });
    }

    getAssembledImage() {
        return this.canvas;
    }

    // On assemble les images et on retourne le canvas produit
    // celui-ci pourra être utilisé en lieu et place de chacune des images
    assemble() {
        // On y dessine toutes les images à la position demandée
        this.canvasContext.save();
        this.canvasContext.translate(
            this.drawingDirection.x <= 0 ? this.canvas.width : 0,
            this.drawingDirection.y <= 0 ? this.canvas.height : 0);
        this.canvasContext.scale(this.drawingZoom.x, this.drawingZoom.y);
        this.images.forEach(imageItem => {
            this.canvasContext.drawImage(
                imageItem.imageSource, 
                imageItem.imagePosition.x, 
                imageItem.imagePosition.y, 
                imageItem.imageSource.width * this.drawingDirection.x, 
                imageItem.imageSource.height * this.drawingDirection.y);
        });
        this.canvasContext.restore();
    }
}

class Parameter {
    constructor() {
        // Affichage en mode collideBox
        this.colliderDisplay = false;
    }
    
    setColliderDisplay(colliderDisplay) {
        if (this.colliderDisplay != colliderDisplay) {
            this.colliderDisplay = colliderDisplay;
        }
    }
}

class BaseScheduler {
    constructor() {
        this.observers = []
        this.lastDt = 0;
        this.baseSpeed = 1;
    }

    register(observer) {
        this.observers.push(observer);
    }
    
    unregister(observer) {
        let index = this.observers.indexOf(observer);
        if (index != -1) {
            this.observers.splice(index, 1);
        }
    }

    notify() {
        this.observers.forEach(observer => {
            observer.subjectChanged(this);
        });
    }

    update(dt) {
        this.lastDt = dt;
    }

    getDeltaTime() {
        return this.lastDt * this.baseSpeed;
    }
}
// Métronome ne faisant rien pour les scènes sans avancement comme le menu principal par exemple.
class DummyScheduler extends BaseScheduler {
    constructor() {
        super();
    }

    register(observer) {
    }
    
    unregister(observer) {
    }

    notify() {
    }

}
class LinearScheduler extends BaseScheduler {
    constructor(speed, startingStep = 0) {
        super();
        this.speed = speed;
        this.currentStep = startingStep;
    }

    update(dt) {
        super.update(dt);
        
        // Avancement linéaire du currentStep
        this.currentStep += this.speed * this.getDeltaTime(); 
        this.notify();
    }
}
// Permet de piloter la vitesse de la scène afin de l'accélérer ou de la ralentier à souhait
class AdaptativeScheduler extends LinearScheduler {
    constructor(speed, startingStep) {
        super(speed, startingStep);
    }

    update(dt) {
        // Pour tester
        // Est-ce qu'on accélère ou ralenti la scène?
        if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyQ")) {
            this.baseSpeed *= 1.1;
        }
        if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyA")) {
            this.baseSpeed *= 0.9;
        }

        // Avancement linéaire du currentStep
        super.update(dt);
    }
}
class Weapon {
    constructor(playerShip, initialWeaponState) {
        this.playerShip = playerShip;
        this.currentWeaponState = initialWeaponState;
    }

    getName() {
        return this.currentWeaponState.getName();
    }

    update(dt) {
        this.currentWeaponState.update(dt);
    }

    currentLevel() {
        return this.currentWeaponState.currentLevel();
    }

    levelDown() {
        this.currentWeaponState = this.currentWeaponState.levelDown();
    }

    levelUp() {
        this.currentWeaponState = this.currentWeaponState.levelUp();
    }

    fire() {
        this.currentWeaponState.fire();
    }
}

class WeaponFactory {
    static getBulletWeapon(playerShip) {
        const fireRate = 0.2;
        const weaponName = "Bullets";

        // Instanciation des etats
        let soundPool = new SoundPool(Services.get("ASSET").get("Sounds/laser1.mp3"), 15);
        let level1State = new WeaponState(weaponName, new Level1BulletFireCommand(playerShip, fireRate, soundPool), 1);
        let level2State = new WeaponState(weaponName, new Level2BulletFireCommand(playerShip, fireRate * 0.95, soundPool), 2);
        let level3State = new WeaponState(weaponName, new Level3BulletFireCommand(playerShip, fireRate * 0.9, soundPool), 3);
        let level4State = new WeaponState(weaponName, new Level4BulletFireCommand(playerShip, fireRate * 0.85, soundPool), 4);
        let level5State = new WeaponState(weaponName, new Level5BulletFireCommand(playerShip, fireRate * 0.8, soundPool), 5);

        // Liaisons entre les états
        level1State.previousWeaponState = level1State;
        level1State.nextWeaponState = level2State;

        level2State.previousWeaponState = level1State;
        level2State.nextWeaponState = level3State;

        level3State.previousWeaponState = level2State;
        level3State.nextWeaponState = level4State;

        level4State.previousWeaponState = level3State;
        level4State.nextWeaponState = level5State;

        level5State.previousWeaponState = level4State;
        level5State.nextWeaponState = level5State;

        return new Weapon(playerShip, level1State);
    }
}
class WeaponState {
    constructor(name, fireCommand, level) {
        this.fireCommand = fireCommand;
        this.previousWeaponState = this.nextWeaponState = null;
        this.name = name;
        this.level = level;
    }

    getName() {
        return this.name;
    }

    currentLevel() {
        return this.level;
    }

    update(dt) {
        this.fireCommand.update(dt);
    }

    levelDown() {
        return this.previousWeaponState;
    }

    levelUp() {
        return this.nextWeaponState;
    }

    fire() {
        this.fireCommand.execute();
    }
}
class BaseCollideBox {
    constructor(position = new Vec2(), size = new Vec2(), offset = new Vec2()) {
        this.type = "NONE";
        this.isCollided = false;
        this.color = "gray";
        this.position = position;
        this.size = size;
        this.offset = offset;
        this.box = null;
    }

    // static NEUTRAL_COLOR = "gray";
    // static COLLIDED_COLOR = "red";
    // static NOT_COLLIDED_COLOR = "green";

    getOffsetPosition() {
        return new Vec2(this.position.x + this.offset.x, this.position.y + this.offset.y);
    }

    getBox() {
        if (this.box == null) {
            this.box = new RectCollideBox(this.position, this.size, this.offset);;
        }
        return this.box;
    }

    getCollided() {
        return this.isCollided;
    }

    setCollided(value) {
        this.isCollided = value;
    }

    getClone() {
        return new BaseCollideBox(this.position.getClone(), this.size.getClone(), this.offset.getClone());
    }

    update(dt) {
        if (this.type != "NONE") {
            this.color = this.getCollided() ? "red" : "green";
        }
    }

    draw(context) {
    }

    collide(otherCollideBox) {
        return Collider.isCollision(this, otherCollideBox);
    }
}
class CompositeCollideBox extends BaseCollideBox {
    constructor(position, size, offset) {
        super(position, size, offset);
        this.type = "COMPOSITE";
        this.position = position;
        this.collideBoxesCollection = [];
    }

    addCollideBox(collidexBox) {
        this.collideBoxesCollection.push(collidexBox);
    }

    getClone() {
        let clone = new CompositeCollideBox(this.position.getClone(), this.size.getClone(), this.offset.getClone());
        this.collideBoxesCollection.forEach(collidexBox => {
            clone.addCollideBox(collidexBox.getClone());
        });
        return clone;
    }

    getCollided() {
        for (let index = 0; index < this.collideBoxesCollection.length; index++) {
            const collidexBox = this.collideBoxesCollection[index];
            if (collidexBox.getCollided()) {
                return true;
            }
        }        
        return false;
    }

    setCollided(value) {
        this.collideBoxesCollection.forEach(collidexBox => {
            collidexBox.setCollided(value);
        });
    }

    update(dt) {
        this.collideBoxesCollection.forEach(collidexBox => {
            collidexBox.update(dt);
        });
    }

    draw(context) {
        this.collideBoxesCollection.forEach(collidexBox => {
            collidexBox.draw(context);
        });
    }
}
// class CollideBoxType {
//     static NONE = "NONE";
//     static CIRCLE = "CIRCLE";
//     static RECT = "RECT";
//     static COMPOSITE = "COMPOSITE";
//     static QUADRANT = "QUADRANT";
// }
class CircleCollideBox extends BaseCollideBox {
    constructor(position, radius, offset) {
        super(position, new Vec2(2 * radius, 2 * radius), offset);
        this.type = "CIRCLE";
        this.radius = radius;
    }
    
    getClone() {
        return new CircleCollideBox(this.position.getClone(), this.radius, this.offset.getClone());
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        context.translate(this.radius + this.offset.x, this.radius + this.offset.y);
        context.strokeStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
        context.restore();
    }
}
class RectCollideBox extends BaseCollideBox {
    constructor(position, size, offset) {
        super(position, size, offset);
        this.type = "RECT";
    }
        
    getClone() {
        return new RectCollideBox(this.position.getClone(), this.size.getClone(), this.offset.getClone());
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        context.translate(this.offset.x, this.offset.y);
        context.strokeStyle = this.color;
        context.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.restore();
    }
}
class Collider {
    // Y a t'il collision entre nos 2 collideBox?
    static isCollision(baseCollideBox1, baseCollideBox2) {
        let collision;

        switch (baseCollideBox1.type) {
            case "CIRCLE" :
                collision = Collider.isCircleCollision(baseCollideBox1, baseCollideBox2) ;
                break;
            case "RECT" :
                collision = Collider.isRectCollision(baseCollideBox1, baseCollideBox2);
                break;
            case "COMPOSITE" :
                collision = Collider.isCompositeCollision(baseCollideBox1, baseCollideBox2);
                break;                            
        }

        baseCollideBox1.setCollided(collision || baseCollideBox1.getCollided());
        baseCollideBox2.setCollided(collision || baseCollideBox2.getCollided());

        return collision;
    }

    // Y a t'il collision entre notre composite et l'autre collideBox?
    static isCompositeCollision(compositeCollideBox, baseCollideBox) {
        for (let index = 0; index < compositeCollideBox.collideBoxesCollection.length; index++) {
            const collidexBox = compositeCollideBox.collideBoxesCollection[index];
            if (Collider.isCollision(collidexBox, baseCollideBox)) {
                compositeCollideBox.setCollided(true);
                baseCollideBox.setCollided(true);
                return true;
            }
        }
        return false;        
    }

    // Y a t'il collision entre notre rectangle et l'autre collideBox?
    static isRectCollision(rectCollideBox, baseCollideBox) {
        switch (baseCollideBox.type) {
            case "RECT" :
                return Collider.isRectangleInRectangle(rectCollideBox, baseCollideBox);
                break;
            case "CIRCLE" :
                return Collider.isCircleInRectangle(baseCollideBox, rectCollideBox);
                break;
            case "COMPOSITE" :
                return Collider.isCompositeCollision(baseCollideBox, rectCollideBox);
                break;
            }
        return false;
    }

    // Y a t'il collision entre notre cercle et l'autre collideBox?
    static isCircleCollision(circleCollideBox, baseCollideBox) {
        switch (baseCollideBox.type) {
            case "CIRCLE" :
                return Collider.isCircleInCircle(circleCollideBox, baseCollideBox);
                break;
            case "RECT" :
                return Collider.isCircleInRectangle(circleCollideBox, baseCollideBox);
                break;           
            case "COMPOSITE" :
                return Collider.isCompositeCollision(baseCollideBox, circleCollideBox);
                break;
        }
        return false;
    }

    // Y a t'il collision entre nos 2 cercles
    static isCircleInCircle(circleCollideBox1, circleCollideBox2) {
        let position1 = circleCollideBox1.getOffsetPosition();
        let position2 = circleCollideBox2.getOffsetPosition();
        return (
            Tools.distance(
                new Vec2(position1.x + circleCollideBox1.radius, position1.y + circleCollideBox1.radius), 
                new Vec2(position2.x + circleCollideBox2.radius, position2.y + circleCollideBox2.radius)) 
                < (circleCollideBox1.radius + circleCollideBox2.radius));
    }

    // Y a t'il collision entre nos 2 rectangles
    static isRectangleInRectangle(rectCollideBox1, rectCollideBox2) {
        let position1 = rectCollideBox1.getOffsetPosition();
        let position2 = rectCollideBox2.getOffsetPosition();
        return (
            position1.x < position2.x + rectCollideBox2.size.x &&
            position1.x + rectCollideBox1.size.x > position2.x &&
            position1.y < position2.y + rectCollideBox2.size.y &&
            rectCollideBox1.size.y + rectCollideBox1.position.y > position2.y)
    }

    // Y a t'il collision entre notre cerle et le rectangle
    static isCircleInRectangle(circleCollideBox, rectCollideBox) {
        let position1 = circleCollideBox.getOffsetPosition();
        let position2 = rectCollideBox.getOffsetPosition();

        let distX = Math.abs(position1.x + circleCollideBox.radius - position2.x - rectCollideBox.size.x / 2);
        let distY = Math.abs(position1.y + circleCollideBox.radius  - position2.y - rectCollideBox.size.y / 2);

        if (distX > (rectCollideBox.size.x /2 + circleCollideBox.radius)) return false;
        if (distY > (rectCollideBox.size.y /2 + circleCollideBox.radius)) return false;

        if (distX <= (rectCollideBox.size.x / 2))  return true;
        if (distY <= (rectCollideBox.size.y / 2))  return true;

        let dx = distX - rectCollideBox.size.x / 2;
        let dy = distY - rectCollideBox.size.y / 2;
        return (dx * dx + dy * dy <= circleCollideBox.radius * circleCollideBox.radius);    
    }

    // Y a t'il collision entre notre point et le rectangle (utilisé pour les clics sur les boutons principalement)
    static isPointInRectangle(point, rectangle) {
        let position = rectangle.getOffsetPosition();
        return (position.x <= point.x && point.x <= position.x + rectangle.size.x &&
            position.y <= point.y && point.y <= position.y + rectangle.size.y);
    }
}
// Classe permettant de découper l'espace
// pour y placer tous les gameObjects intervenants dans les collisions
// afin de limiter le nombre de test à chaque frame
class QuadTree extends RectCollideBox {
    constructor(position, size, level = 0) {
        super(position, size);
        this.type = "QUADRANT";
        this.color = "gray";

        // Liste des items gérés dans le cas d'une leaf
        // Par défaut on démarre dans cet état
        this.items = [];
        
        // Liste des surfaces gérées dans le cas d'un node
        this.children = null;

        // Niveau de profondeur atteint
        this.level = level;
    
        // Limite d'objets dans un quadrant (limite avant de découper)
        const LengthLimit = 12;

        // Limite de profondeur du QuadTree
        const MaxLevel = 5;
    }


    getCandidates(collideBox) {
        let candidates = [];
        if (Collider.isRectangleInRectangle(this, collideBox.getBox())) {
            if (this.items == null) {
                this.children.forEach(child => {
                    Array.prototype.push.apply(candidates, child.getCandidates(collideBox));
                });
                return candidates;
            }
            else {
                return this.items;
            }
        }
        return candidates;
    }

    setPartition() {
        // On découpe le quadrant en sous-quadrants
        let newSizeX1 = Math.floor(this.size.x / 2);
        let newSizeX2 = this.size.x - newSizeX1;
        let newSizeY1 = Math.floor(this.size.y / 2);
        let newSizeY2 = this.size.y - newSizeY1;

        // Création et stockage des sous-quadrants
        this.children = [];
        this.children.push(
            new QuadTree(this.position.getClone(), new Vec2(newSizeX1, newSizeY1), this.level + 1), 
            new QuadTree(new Vec2(this.position.x + newSizeX1, this.position.y), new Vec2(newSizeX2, newSizeY1), this.level + 1), 
            new QuadTree(new Vec2(this.position.x, this.position.y + newSizeY1), new Vec2(newSizeX1, newSizeY2), this.level + 1), 
            new QuadTree(new Vec2(this.position.x + newSizeX1, this.position.y + newSizeY2), new Vec2(newSizeX2, newSizeY2), this.level + 1));
    }

    addItem(gameOject) {
        if (this.children == null) {
            // On ajoute l'objet au quadrant
            this.items.push(gameOject);

            // Est-ce qu'il faut partitionner le quadrant? et est-ce que c'est encore faisable?
            // Sinon cette se remplira sans se diviser
            if (this.items.length > this.LengthLimit && this.level < this.MaxLevel) {

                // Découpage en sous-quadrants
                this.setPartition();

                // Chacun des objets est dispatché dans les nouveaux quadrants
                this.items.forEach(item => {
                    this.addItem(item);
                });            

                // On purge le tableau d'éléments
                this.items = null;
            }
        }
        else {
            // On est sur un node, donc on ajoute le gameObject aux sous-quadrants
            this.children.forEach(subQuadrant => {
                if (Collider.isRectangleInRectangle(subQuadrant, gameOject.collideBox.getBox())) {
                    subQuadrant.addItem(gameOject);
                }
            });
        }

    }

    draw(context) {
        if (this.children == null) {
            super.draw(context);
            context.save();
            context.fillStyle = this.color;
            context.font = "normal 10pt Arial";
            context.fillText("Items : " + this.items.length, this.position.x + 5 , this.position.y + 15);
            context.restore();
        }
        else {
            this.children.forEach(child => {
                child.draw(context);
            });
        }
    }
}
class GameObject {
    constructor() {
        this.type = "NONE";
        this.position = new Vec2();
        this.size = new Vec2();
        this.vector = new Vec2();
        this.speed = 0;
        this.collideBox = new BaseCollideBox();
        this.status = "ACTIVE";
        this.layer = 1;
        this.partition = "GAME_PARTITION";
        this.maxLife = 0;
        this.life = 0;
        this.moveStrategy = new DummyMoveStrategy();
        this.fireCommand = new DummyCommand();
        this.collideCommand = new DummyCommand();
        this.dealDamageCommand = new DummyCommand();
        this.dieCommand = new CompositeCommand();
        this.dieCommand.addCommand(new DieCommand(this));
        this.takeDamage = new DummyCommand();
    }

    damage(amount) {
        this.life -= amount;
        if (this.life <= 0) {
            this.life = Tools.clamp(this.life, 0, this.maxLife);
            this.dieCommand.execute();
        }
    }    

    // Mise à jour du gameObject
    // Les comportements sont modélisés dans des commandes
    update(dt) {
        // Mise à jour et application du movement
        this.moveStrategy.update(dt);

        // Mise à jour des commandes
        this.fireCommand.update(dt);
        this.collideCommand.update(dt);
        this.dealDamageCommand.update(dt);
        this.dieCommand.update(dt);

        // Mise à jour de la boite de collision
        this.collideBox.update(dt);
    }

    // Affichage du gameObject
    draw(context) {
        if (Services.get("PARAMETER").colliderDisplay) {
            this.collideBox.draw(context);
        }
    }
}
// class GameObjectPartition {
//     // Partition netre les objets pour limiter les tests de collision
//     static PLAYER_PARTITION = "PLAYER";
//     static GAME_PARTITION = "GAME";
//     static NEUTRAL_PARTITION = "NEUTRAL";
// }
// class GameObjectState {
//     // Différentes états que peut prendre un gameObject
//     static IDLE = "IDLE";
//     static ACTIVE = "ACTIVE";
//     static OUTDATED = "OUTDATED";
// }
// class GameObjectType {
//     // Différentes type de gameObjects
//     static NONE = "NONE";
//     static SHIP = "SHIP";
//     static MISSILE = "MISSILE";
//     static BONUS = "BONUS";
// }
class BaseShape extends GameObject {
    constructor(color) {
        super();
        this.color = color;
    }

    update(dt) {
        super.update(dt);
    }
}
class CircleShape extends BaseShape {
    constructor(color, size) {
        super(color);
        this.size.x = size.x;
        this.size.y = size.y;
    }

    draw(context) {
        context.save();
        context.translate(this.size.x / 2, this.size.y / 2);
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.size.x / 2, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    }
}
class RectShape extends BaseShape {
    constructor(color) {
        super(color);
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        context.restore();
    }
}
class Sprite extends GameObject {
    constructor(image) {
        super();
        this.image = image;
        this.originalSize = new Vec2(this.image.width, this.image.height);
        this.size = new Vec2(this.image.width, this.image.height);
        this.scale = new Vec2(1);
        this.alpha = 1;
    }

    getClone() {
        return new Sprite(this.image);
    }

    update(dt) {
        super.update(dt);
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.globalAlpha;
        context.drawImage(
            this.image, 
            Math.floor(this.position.x), 
            Math.floor(this.position.y));
        context.restore();
        if (Services.get("PARAMETER").colliderDisplay) {
            this.collideBox.draw(context);
        }
    }
}
class DoubleSprite extends GameObject {
    constructor(firstSprite, secondSprite, speed) {
        super();
        this.firstSprite = firstSprite;
        this.secondSprite = secondSprite;
        this.size.x = Math.max(this.firstSprite.size.x, this.secondSprite.size.x);
        this.size.y = Math.max(this.firstSprite.size.y, this.secondSprite.size.y);
        this.secondeSpriteOffset = new Vec2((this.firstSprite.size.x - this.secondSprite.size.x) / 2, (this.firstSprite.size.y - this.secondSprite.size.y) / 2);
        this.collideBox = new CircleCollideBox(this.position, Math.max(this.firstSprite.size.x, this.secondSprite.size.x) / 2)
        this.firstSprite.collideBox.type = this.secondSprite.collideBox.type = "NONE";
        this.alpha = 1;
        this.speed = speed;
        this.firstSprite.speed = this.secondSprite.speed = 0;
    }

    update(dt) {
        super.update(dt);

        this.firstSprite.update(dt);
        this.firstSprite.position.x = this.position.x;
        this.firstSprite.position.y = this.position.y;

        this.secondSprite.update(dt);
        this.secondSprite.position.x = this.position.x + this.secondeSpriteOffset.x;
        this.secondSprite.position.y = this.position.y + this.secondeSpriteOffset.y;
    }

    draw(context) {
        this.firstSprite.draw(context);
        this.secondSprite.draw(context);
        if (Services.get("PARAMETER").colliderDisplay) {
            this.collideBox.draw(context);
        }
    }
}
class TailedSprite extends GameObject {
    constructor(headSprite, bodySprite, tailSprite, nbBody) {
        super();
        this.headSprite = headSprite;
        this.bodySprite = bodySprite;
        this.tailSprite = tailSprite;
        this.nbBody = nbBody;
        this.currentNbBody = 0;
        this.bodySprites = [];
        this.momentumTtl = 0.1;
        this.ttl = this.momentumTtl;
    }

    update(dt) {
        super.update(dt);
        this.ttl -= dt;
        if (this.ttl <= 0) {
            this.ttl = this.momentumTtl;
            if (this.currentNbBody < this.nbBody) {
                this.bodySprites.push(this.bodySprite.getClone());
                this.currentNbBody++;
            }
            if (this.currentNbBody != 0) {
                this.tailSprite.position.x = this.bodySprites[this.currentNbBody - 1].position.x;
                this.tailSprite.position.y = this.bodySprites[this.currentNbBody - 1].position.y;
                for (let index = this.currentNbBody - 1; index > 0; index--) {
                    this.bodySprites[index].position.x = this.bodySprites[index - 1].position.x;
                    this.bodySprites[index].position.y = this.bodySprites[index - 1].position.y;
                }        
                this.bodySprites[0].position.x = this.headSprite.position.x;
                this.bodySprites[0].position.y = this.headSprite.position.y;
            }
        }
        this.tailSprite.update(dt);
        for (let index = this.currentNbBody - 1; index > 0; index--) {
            this.bodySprites[index].update(dt);
        } 
        this.headSprite.update(dt);
        this.headSprite.position.x = this.position.x;
        this.headSprite.position.y = this.position.y;
    }

    draw(context) {
        if (Services.get("PARAMETER").colliderDisplay) {
            this.collideBox.draw(context);
        }
        else {
            this.tailSprite.draw(context);
            for (let index = 0; index < this.currentNbBody; index++) {
                this.bodySprites[index].draw(context);
            }
            this.headSprite.draw(context);
        }
    }
}
class AnimatedSprite extends GameObject {
    constructor(image, tileSheet, damagedImage = null) {
        super();

        // Pour la gestion des spriteSheet
        this.image = this.notDamagedImage = image;
        this.damagedImage = damagedImage;
        this.currentFrame = 0;
        this.size = tileSheet;
        this.tile = new Vec2();
        this.getNewFrame();

        // Gestion des animations
        this.animations = [];
        this.currentAnimation = null;

        this.damageTtl = 0;
        this.damagedMaxTtl = 0.15;
    }

    damage(amount) {
        super.damage(amount);
        if (this.damagedImage != null) {
            this.damageTtl = this.damagedMaxTtl;
            this.image = this.damagedImage;
        }
    }

    getNewFrame() {
        // On récupère la nouvelle frame de l'animation
        this.tile.x = this.currentFrame % (this.image.width / this.size.x) * this.size.x;
        this.tile.y = Math.floor(this.currentFrame / (this.image.width / this.size.x)) * this.size.y;
    }

    addAnimation(animation) {
        this.animations.push(animation);
    }

    startAnimation(name, frame) {
        // Si l'animation est déjà en cours, on ne la relance pas!
        if (this.currentAnimation != null && this.currentAnimation.name == name && this.currentAnimation.started) return; 

        // On cherche l'animation demandée et on la démarre
        this.animations.forEach(animation => {
            if (animation.name == name) {
                this.currentAnimation = animation;
                this.currentAnimation.start(frame);
            }            
        });
    }

    update(dt) {
        super.update(dt);

        if (this.currentAnimation != null && this.currentAnimation.started) {
            // On avance dans l'animation
            this.currentAnimation.update(dt);
            this.currentFrame = this.currentAnimation.getCurrentFrame();

            // On récupère la nouvelle frame de l'animation
            this.getNewFrame();
        }

        if (this.damageTtl > 0) {
            this.damageTtl -= dt;
            if (this.damageTtl < 0) {
                this.damageTtl = 0;
                this.image = this.notDamagedImage;
            }
        }
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.globalAlpha;
        context.drawImage(
            this.image, 
            Math.floor(this.tile.x), 
            Math.floor(this.tile.y), 
            Math.floor(this.size.x), 
            Math.floor(this.size.y), 
            Math.floor(this.position.x), 
            Math.floor(this.position.y), 
            Math.floor(this.size.x), 
            Math.floor(this.size.y));

        context.restore();
        if (Services.get("PARAMETER").colliderDisplay) {
            this.collideBox.draw(context);
        }    
    }
}
class Animation {
    constructor(name, frameList, speed, loop = false) {
        this.name = name;
        this.frameList = frameList;
        this.speed = speed;
        this.loop = loop;
        this.started = false
        this.frameTimer = 0;
        this.currentFrame = 0;
    }

    getClone() {
        let clone = new Animation(this.name, this.frameList, this.speed, this.loop);
        clone.started = this.started;
        return clone;
    }

    getCurrentFrame() {
        return this.frameList[this.currentFrame];
    }

    start(frame) {
        this.started = true;
        this.frameTimer = 0;
        this.currentFrame = frame;
    }

    update(dt) {
        if (this.started) {
            this.frameTimer += dt;
            if (this.frameTimer >= (this.currentFrame + 1) * this.speed) {
                this.currentFrame++;
                if (this.currentFrame >= this.frameList.length) {
                    if (this.loop) {
                        this.start(0);
                    }
                    else {
                        this.started = false;
                        this.currentFrame = this.frameList.length - 1;
                    }
                }
            }
        }
    }
}
// Gestion des transitions de début et de fin de scène (fondu au noir dans les 2 cas)
class FadingLayer extends GameObject {
    constructor(image, initialVisibility) {
        super();
        this.partition = "NEUTRAL_PARTITION";
        this.sprite = new Sprite(image);
        this.initialVisibility = initialVisibility;
        this.sprite.globalAlpha = this.initialVisibility ? 1 : 0;
        this.pendingVisibility = false;
        this.visibilityTtl = 0;
        this.visibilityMaxTtl = 1;
        this.layer = 100;
        this.showCommand = this.hideCommand = null;
    }

    hide(command) {
        this.hideCommand = command;
        this.pendingVisibility = true;
        this.alphaDirection = -1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    show(command) {
        this.showCommand = command;
        this.pendingVisibility = true;
        this.alphaDirection = 1;
        this.visibilityTtl = 0;
    }
    
    getRatio() {
        return this.visibilityTtl / this.visibilityMaxTtl;
    }

    update(dt) {
        super.update(dt);
        if (this.pendingVisibility) 
        {
            this.visibilityTtl += this.alphaDirection * dt;
            if (this.visibilityTtl < 0 || this.visibilityTtl > this.visibilityMaxTtl) {
                this.pendingVisibility = false;
                this.visibilityTtl = 0
                if (this.alphaDirection == 1 && this.showCommand != null) {
                    this.showCommand.execute();
                }
                if (this.alphaDirection == -1 && this.hideCommand != null) {
                    this.hideCommand.execute();
                }
            }
            else {
                this.sprite.globalAlpha = this.getRatio();
            }
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}
// Gestion des transitions de début et de fin de scène (fondu au noir dans les 2 cas)
class FlashingLayer extends GameObject {
    constructor(image) {
        super();
        this.partition = "NEUTRAL_PARTITION";
        this.sprite = new Sprite(image);
        this.sprite.globalAlpha = 0.5;
        this.visibilityTtl = this.visibilityMaxTtl = 1;
        this.status = "IDLE";
    }

    show() {
        this.status = "ACTIVE";
        this.visibilityTtl = this.visibilityMaxTtl;
        this.sprite.globalAlpha = 1;
    }

    update(dt) {
        super.update(dt);
        if (this.status == "ACTIVE") {
            this.visibilityTtl -= dt;
            if (this.visibilityTtl < 0) {
                this.status = "IDLE";               
            }
            this.sprite.globalAlpha = this.visibilityTtl / this.visibilityMaxTtl;
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}
// Partie de scrolling qui ne produira qu'une fois
// C'est un observer abonné au métronome de la scène en cours
// pour savoir quand commencer à apparaître
class OnceLayer extends GameObject {
    constructor(layer, sceneSpeed, image, startAt, direction) {
        super();

        this.partition = "NEUTRAL_PARTITION";
        this.layer = layer;
        this.startAt = startAt;
        this.status = "IDLE";

        this.sprite = new Sprite(image);
        this.sprite.speed = layer * sceneSpeed;
        this.sprite.moveStrategy = new UniformMoveStrategy(this.sprite, direction.getClone());
    }
    
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            this.status = "ACTIVE";
            this.sprite.position.x = Services.get("SCREEN").width;
            this.sprite.position.y = 0;
            scheduler.unregister(this);
        }
    }

    update(dt) {
        super.update(dt);
        this.sprite.update(dt);
        if (Tools.isOutOfScreen(this.sprite.position, this.sprite.size)) {
            this.status = "OUTDATED";
        }
    }

    draw(context) {
        this.sprite.draw(context);
    }
}
// Fond d'écran qui tourne en permanence et se répère à l'infini
class RollingLayer extends GameObject {
    constructor(layer, sceneSpeed, visual, direction) {
        super();
        this.layer = layer;

        this.partition = "NEUTRAL_PARTITION";

        this.firstSprite = new Sprite(visual);
        this.firstSprite.speed = layer * sceneSpeed;
        this.firstSprite.position = new Vec2();

        this.secondSprite = this.firstSprite.getClone();
        this.secondSprite.speed = this.firstSprite.speed;
        this.secondSprite.position = new Vec2(this.firstSprite.size.x, 0);

        this.firstSprite.moveStrategy = new UniformMoveStrategy(this.firstSprite, direction.getClone());
        this.secondSprite.moveStrategy = new UniformMoveStrategy(this.secondSprite, direction.getClone());
    }

    update(dt) {
        super.update(dt);
        this.firstSprite.update(dt);
        this.secondSprite.update(dt);
        if (this.secondSprite.position.x < 0) {
            this.firstSprite.position.x = 0;
            this.secondSprite.position.x = this.firstSprite.size.x;
        }
    }

    draw(context) {
        this.firstSprite.draw(context);
        this.secondSprite.draw(context);
    }
}
// Background static, c'est à dire qui ne bouge pas avec le scrolling.
// Utilisé pour faire la couleur de fond des niveaux,
// ou pour afficher une image dans les scènes qui ne bougent pas (menu ou autre)
class StaticLayer extends GameObject {
    constructor(layer, visual) {
        super();
        this.partition = "NEUTRAL_PARTITION";
        this.layer = layer;
        this.visual = visual;
    }

    draw(context) {
        this.visual.draw(context);
    }
}
// 
class DecorsGameObject extends GameObject {
    constructor(image, layer, sceneSpeed, startAt, initialPosition, active) {
        super()
        this.image = image;
        this.startAt = startAt;
        this.initialPosition = initialPosition;
        this.layer = layer;
        this.status = "IDLE";
        this.sprite = new Sprite(image);
        this.sprite.speed = layer * sceneSpeed;
        this.sprite.moveStrategy = new UniformMoveStrategy(this.sprite, new Vec2(-1, 0));
        if (active) {
            this.collideBox = new RectCollideBox(this.sprite.position, this.sprite.size);
        }
    }
    
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            this.status = "ACTIVE";
            this.sprite.position.x = this.initialPosition.x;
            this.sprite.position.y = this.initialPosition.y;
            scheduler.unregister(this);
        }
    }

    update(dt) {
        super.update(dt);
        this.sprite.update(dt);
        if (Tools.isOutOfScreen(this.sprite.position, this.sprite.size)) {
            this.status = "OUTDATED";
        }
    }

    draw(context) {
        super.draw(context);
        this.sprite.draw(context);
    }
}
class ExplosionGameObject extends AnimatedSprite {
    constructor(image, size, speed = 15) {
        super(image, size)
        this.type = "NONE";
        this.partition = "NEUTRAL_PARTITION";
        this.status = "IDLE";
        this.layer = 0.99;
        this.speed = speed;
        let animationTable = [0, 4, 7, 6, 5, 4, 3, 2, 1, 0];
        this.addAnimation(new Animation("IDLE", animationTable, this.speed / 1000, true));
        this.startAnimation("IDLE", 0);
        this.totalTtl = animationTable.length * this.speed / 1000;
    }

    update(dt) {
        super.update(dt);
        this.totalTtl -= dt;
        if (this.totalTtl <= 0) {
            this.status = "OUTDATED";
        }
    }
}

// Classe définissant un bonus
class BonusGameObject extends DoubleSprite {
    constructor(gameObject, sparkSprite, bonusSprite, speed) {
        super(sparkSprite, bonusSprite, speed);
        this.gameObject = gameObject;
        this.type = "BONUS";
        this.partition = "GAME_PARTITION";
        this.status = "ACTIVE";
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 10, Math.random() * 2 * Math.PI);
    }

    update(dt) {
        super.update(dt);

    }

    draw(context) {
        super.draw(context);
    }
}

class BulletGameObject extends AnimatedSprite {
    constructor(image, size, partition, direction, speed, damageAmount) {
        super(image, size)
        this.type = "MISSILE";
        this.partition = partition;
        this.status = "ACTIVE";
        this.speed = speed;
        this.damageAmount = damageAmount;
        this.direction = direction;
        this.collideBox = new CircleCollideBox(this.position, 0.6 * this.size.x / 2, new Vec2(0.3 * this.size.x / 2, 0.3 * this.size.y / 2));
        this.layer = 0.990;
        this.moveStrategy = new UniformMoveStrategy(this, direction);
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 10 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.collideCommand = new MissileCollideCommand(this);
        this.dealDamageCommand = new DealDamageCommand(this, damageAmount);
        this.dieCommand.addCommand(new DieCommand(this));
    }
}

class PlayerShipGameObject extends AnimatedSprite {
    constructor(image, tile, initialPosition) {
        super(image, tile)
        this.type = "SHIP";
        this.collideBox = new CircleCollideBox(this.position, 0.6 * this.size.x / 2, new Vec2(0.3 * this.size.x / 2, 0.3 * this.size.x / 2));
        this.layer = 1;
        this.partition = "PLAYER_PARTITION";
        this.moveStrategy = new PlayerControlledMoveStrategy(this);
        this.position.x = initialPosition.x;
        this.position.y = initialPosition.y;
        this.collideCommand = new ShipCollideCommand(this);
        this.fireCommand = new WeaponFireCommand(this, WeaponFactory.getBulletWeapon(this));

        // Paramétrage du vaisseau du joueur
        this.life = this.maxLife = 1000;
        this.speed = 200;

        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
        this.thrust = new ParticlesThrustGameObject(this, new BlueExplosionGameObject(60));
    }

    update(dt) {
        super.update(dt);
        this.thrust.update(dt);
    }
}
class EnemyShipGameObject extends AnimatedSprite {
    constructor(image, tile, maxLife, speed, damagedImage = null) {
        super(image, tile, damagedImage)
        this.type = "SHIP";
        this.collideBox = new CircleCollideBox(this.position, 0.8 * this.size.x / 2, new Vec2(0.3 * this.size.x / 2, 0.2 * this.size.y / 2));
        this.layer = 0.995;
        this.partition = "GAME_PARTITION";
        this.collideCommand = new ShipCollideCommand(this);
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new MediumRedExplosionGameObject(100), new RedExplosionGameObject(75) ])));
        this.life = this.maxLife = maxLife;
        this.speed = speed;
        this.dealDamageCommand = new DealDamageCommand(this, this.maxLife);
        this.takeDamage = new TakeDamageCommand(this);
    }

    draw(context) {
        super.draw(context);

        // On dessine une barre de vie de la hauteur du sprite
        if (Services.get("PARAMETER").colliderDisplay) {
            context.save();
            context.fillStyle = "red";
            context.fillRect(this.position.x + this.size.x, this.position.y, 8, this.size.y);
            context.fillStyle = "green";
            context.fillRect(this.position.x + this.size.x, this.position.y + this.size.y - Math.floor(this.size.y * this.life / this.maxLife), 8, Math.floor(this.size.y * this.life / this.maxLife));
            context.strokeStyle = "white";
            context.strokeRect(this.position.x + this.size.x, this.position.y, 8, this.size.y);
            context.restore();
        }
    }
}
class SparkGameObject extends AnimatedSprite {
    constructor(image) {
        let factor = 1.5;
        let sparkImage = image;
        let imageZoomer = new ImageHandler(new Vec2(sparkImage.width * factor, sparkImage.height * factor), new Vec2(factor, factor));
        imageZoomer.addImage(sparkImage);
        imageZoomer.assemble();
        sparkImage = imageZoomer.getAssembledImage();
        // super(sparkImage, new Vec2(100 * factor, 100 * factor));
        super(image, new Vec2(100, 100))
        this.layer = 1;
        this.partition = "GAME_PARTITION";
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 200 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}
class RocketGameObject extends AnimatedSprite {
    constructor(image, size, partition, direction, speed, damageAmount) {
        super(image, size)
        this.type = "MISSILE";
        this.partition = partition;
        this.status = "ACTIVE";
        this.speed = speed;
        this.damageAmount = damageAmount;
        this.direction = direction;
        this.collideBox = new CircleCollideBox(this.position, this.size.x / 2);
        this.layer = 1;
        this.moveStrategy = new RocketApexMoveStrategy(this);
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 25 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.collideCommand = new MissileCollideCommand(this);
        this.dealDamageCommand = new DealDamageCommand(this, damageAmount);
        this.dieCommand = new DieCommand(this);
    }
}

class Particle {
    constructor(image, position) {
        this.image = image;
        this.position = position.getClone();
        this.angle = Math.random() * 2 * Math.PI;
        this.rotation = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 40 + 20;
        this.ttl = Math.random() * 3 + 2;
        this.alive = true;
    }

    update(dt) {
        if (this.alive) {
            this.ttl -= dt;
            this.alive = this.ttl > 0;
            this.position.x += this.speed * Math.cos(this.angle) * dt;
            this.position.y += this.speed * Math.sin(this.angle) * dt;
        }
    }

    draw(context) {
        if (this.alive) {
            context.save();
            context.translate(this.position.x + this.image.width / 2, this.position.y + this.image.height / 2);
            context.rotate(this.rotation);
            context.globalAlpha = this.ttl / 5;
            context.drawImage(this.image, 0, 0);
            context.restore();
        }
    }
}
class ParticlesManager extends GameObject {
    constructor(position) {
        super();
        this.position = position.getClone();
        // On crée les particule prototype
        this.prototypes = [];
        this.prototypes.push(this.createPrototype(10, "red"));
        this.prototypes.push(this.createPrototype(20, "red"));
        this.prototypes.push(this.createPrototype(30, "red"));
        this.prototypes.push(this.createPrototype(10, "green"));
        this.prototypes.push(this.createPrototype(20, "green"));
        this.prototypes.push(this.createPrototype(30, "green"));
        this.prototypes.push(this.createPrototype(10, "blue"));
        this.prototypes.push(this.createPrototype(20, "blue"));
        this.prototypes.push(this.createPrototype(30, "blue"));

        this.create();
    }
    
    create() {
        this.particles = [];
        for (let index = 0; index < 50; index++) {
            this.particles.push(new Particle(this.prototypes[Math.floor(Math.random() * 9)], this.position));            
        }
    }

    createPrototype(size, color) {
        let canvas = ImageHandler.createCanvas(size, size);
        let context = canvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(0, 0, size, size);
        return canvas;
    }

    update(dt) {
        this.particles.forEach(particle => {
            particle.update(dt);
        });
    }

    draw(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
        });
    }
}
class BaseLifeBarGameObject extends AnimatedSprite {
    constructor(background) {
        super(background, new Vec2(472, 99));

        this.addAnimation(new Animation("0Life", [0], 0, false));
        this.addAnimation(new Animation("1Life", [1], 0, false));
        this.addAnimation(new Animation("2Life", [2], 0, false));
        this.addAnimation(new Animation("3Life", [3], 0, false));
        this.addAnimation(new Animation("4Life", [4], 0, false));
        this.addAnimation(new Animation("5Life", [5], 0, false));
        this.addAnimation(new Animation("6Life", [6], 0, false));
        this.addAnimation(new Animation("7Life", [7], 0, false));
        this.addAnimation(new Animation("8Life", [8], 0, false));
        this.addAnimation(new Animation("9Life", [9], 0, false));
        this.addAnimation(new Animation("10Life", [10], 0, false));
        this.addAnimation(new Animation("11Life", [11], 0, false));
        this.addAnimation(new Animation("12Life", [12], 0, false));
        this.addAnimation(new Animation("13Life", [13], 0, false));
        this.addAnimation(new Animation("14Life", [14], 0, false));
        this.startAnimation("14Life", 0);
    }

    setRatio(ratio) {
        let animation =  Math.floor(ratio / 7 * 100) + "Life";
        this.startAnimation(animation, 0);
    }
}
class LifeBarGameObject extends BaseLifeBarGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/Gui/lifeBar.png"));
    }
}
class RedLifeBarGameObject extends BaseLifeBarGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/Gui/lifeBar2.png"));

        this.animations = [];
        this.addAnimation(new Animation("0Life", [14], 0, false));
        this.addAnimation(new Animation("1Life", [13], 0, false));
        this.addAnimation(new Animation("2Life", [12], 0, false));
        this.addAnimation(new Animation("3Life", [11], 0, false));
        this.addAnimation(new Animation("4Life", [10], 0, false));
        this.addAnimation(new Animation("5Life", [9], 0, false));
        this.addAnimation(new Animation("6Life", [8], 0, false));
        this.addAnimation(new Animation("7Life", [7], 0, false));
        this.addAnimation(new Animation("8Life", [6], 0, false));
        this.addAnimation(new Animation("9Life", [5], 0, false));
        this.addAnimation(new Animation("10Life", [4], 0, false));
        this.addAnimation(new Animation("11Life", [3], 0, false));
        this.addAnimation(new Animation("12Life", [2], 0, false));
        this.addAnimation(new Animation("13Life", [1], 0, false));
        this.addAnimation(new Animation("14Life", [0], 0, false));
        this.startAnimation("14Life", 0);
    }
}
// Définition de base d'un spawner
// Un spawner est un élément qui en fait apparaitre d'autre
class BaseSpawner extends GameObject {
    constructor(gameObjectPrototype, spawnNumber, appearPoint) {
        super();
        this.gameObjectPrototype = gameObjectPrototype;
        this.spawnNumber = spawnNumber;
        this.appearPoint = appearPoint;
        if (null != appearPoint && null != appearPoint.position) {
            this.position = appearPoint.position;
            this.size = appearPoint.size;
        }
        else {
            this.position.x = appearPoint.x;
            this.position.y = appearPoint.y;
            this.size.x = this.size.y = 0;
        }
    }

    update(dt) {
        super.update(dt);
    }

    spawn() {

    }
}
// Toues les éléments apparaissent en même temps du même points et partent dans toutes les directions
class AllInCircleSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, appearPoint, spawnNumber, startAt) {
        super(gameObjectPrototype, spawnNumber, appearPoint);
        this.startAt = startAt;
        this.spawns = [];
        this.status = "IDLE";

        this.spawns = [];
        let deltaAngle = 2 * Math.PI / this.spawnNumber;

        // On spawne tous les exemplaires demandés
        for (let index = 0; index < this.spawnNumber; index++) {
    
            // Duplication du prototype
            let newShip = this.gameObjectPrototype.getClone();
            newShip.position.x = this.position.x + this.size.x / 2;
            newShip.position.y = this.position.y + this.size.y / 2;
            
            newShip.moveStrategy = this.gameObjectPrototype.moveStrategy.getClone(newShip);
            newShip.moveStrategy.rotate(deltaAngle * index);

            // On l'ajoute à la liste des gameObjects de la scene
            this.spawns.push(newShip);            
        }
    }

    getClone() {
        return new AllInCircleSpawnerGameObject(this.gameObjectPrototype, this.appearPoint.getClone(), this.spawnNumber, this.startAt);
    }

    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = "OUTDATED";
            this.spawn();
        }
    }

    update(dt) {
        if (this.startAt == 0) {
            this.spawn();
            this.status = "OUTDATED";
        }
    }

    spawn() {
        // On spawne tous les exemplaires demandés
        this.spawns.forEach(spawnShip => {
            
            // On l'ajoute à la liste des gameObjects de la scene
            Services.get("SCENE").currentScene.addGameObject(spawnShip);            
        });
    }
}
// Les éléments apparaissent les uns à la suite des autres en fonction du timer demandé
class TimeSequenceSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, startAt, appearPoint, spawnSpeed, spawnNumber) {
        super(gameObjectPrototype, spawnNumber, appearPoint);
        this.startAt = startAt;
        this.spawnSpeed = spawnSpeed;
        this.spawnTime = this.spawnSpeed;
        this.status = "IDLE";
        this.initialSpawnNumber = this.spawnNumber;
        this.getReward = false;
        this.rewardChance = 1 / spawnNumber;
    }
      
    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = "ACTIVE";
            this.spawn();
        }
    }

    update(dt) {
        super.update(dt);
        // Rafraichissement de la fréquence de spawn
        this.spawnTime -= dt;
        if (this.spawnTime <= 0) {
            this.spawn();
        }

        // Si il n'y a plus rien à spanwer, il devient obsolète
        if (this.spawnNumber == 0) {
            this.status = "OUTDATED";
        }
    }     

    spawn() {
        // Duplication du prototype
        // On l'ajoute à la liste des gameObjects de la scene
        let newShip = this.gameObjectPrototype.getClone();
        newShip.position.x = this.position.x + this.size.x / 2;
        newShip.position.y = this.position.y + this.size.y / 2;
        Services.get("SCENE").currentScene.addGameObject(newShip);

        // On passe au suivant
        this.spawnNumber--;
        this.spawnTime = this.spawnSpeed;

        // On ajoute un bonus
        if (!this.getReward) {
            if (Math.random() < this.rewardChance) {
                this.getReward = true;
                let bonus = null;
                let currentStep = Services.get("SCENE").currentScene.scheduler.currentStep;
                let playerShip = Services.get("SCENE").currentScene.playerShip;
                let pivot = currentStep <= 4000 ? 0.15 : (currentStep <= 8000 ? 0.5 : 0.85) ;
                if (Math.random() < pivot) {
                    bonus = new LifePowerUpGameObject(playerShip);
                }
                else {
                    bonus = new WeaponPowerUpGameObject(playerShip);
                }
                newShip.dieCommand.addCommand(new PopCommand(newShip, bonus));
            }
            else {
                this.rewardChance = (this.initialSpawnNumber - this.spawnNumber) / this.initialSpawnNumber;
            }
        }
    }
}
// Les éléments apparaissent les uns à la suite des autres en fonction du timer demandé
class OnceSpawnerGameObject extends BaseSpawner {
    constructor(gameObjectPrototype, startAt, appearPoint, sound = null) {
        super(gameObjectPrototype, 1, appearPoint);
        this.startAt = startAt;
        this.status = "IDLE";
        this.sound = sound;
        this.initialSpawnNumber = this.spawnNumber;
        gameObjectPrototype.position.x = appearPoint.x;
        gameObjectPrototype.position.y = appearPoint.y;
    }
      
    // Est-ce que le spawner rentre en action?
    subjectChanged(scheduler) {
        if (scheduler.currentStep >= this.startAt) {
            scheduler.unregister(this);
            this.status = "OUTDATED";
            this.spawn();
        }
    }

    spawn() {
        // Duplication du prototype
        // On l'ajoute à la liste des gameObjects de la scene
        if (this.sound != null) {
            this.sound.play();
        }
        Services.get("SCENE").currentScene.addGameObject(this.gameObjectPrototype);
    }
}
class BezierCurve {
    constructor(duration, pointsList) {
        this.duration = duration;
        this.pointsList = pointsList;
        this.elapse = 0;
        this.currentPoint = new Vec2(this.pointsList[0].x, this.pointsList[0].y);
    }

    reset() {
        this.elapse = 0;
    }

    isEnded() {
        return this.elapse >= this.duration;
    }

    getClone() {
        let cloneArray = []
        this.pointsList.forEach(point => {
            cloneArray.push(point.getClone());
        });
        return new BezierCurve(this.duration, cloneArray);
    }

    rotate(angle, origine = null) {
        let first;
        let previousPoint;
        if (origine  == null) {
            first = true;
            previousPoint = new Vec2();
        }
        else {
            first = false;
            previousPoint = origine.getClone();
        }
        this.pointsList.forEach(point => {
            if (first) {
                first = false;
                previousPoint.x = point.x;
                previousPoint.y = point.y;
                }
            else {
                let newAngle = Math.atan2(point.y - previousPoint.y, point.x - previousPoint.x) + angle;
                let longueur = Tools.distance(point, previousPoint);
                point.x = previousPoint.x + longueur * Math.cos(newAngle);
                point.y = previousPoint.y + longueur * Math.sin(newAngle);
            }
        });
    }

    update(dt) {
        // Ou en est-on dans l'avancement sur la trajectoire
        this.elapse += dt;
        let ratio = Tools.clamp(this.elapse / this.duration, 0, 1);

        // On démarre avec la liste complète
        let table = this.pointsList

        // Tant qu'il reste des points à "lerper" on continue
        while(table.length > 1) {
            let newtable = [];

            // On "lerpe" chaque point avec le suivant
            for (let index = 0; index < table.length - 1; index++) {
                const item = table[index];
                const siblingItem = table[index + 1];

                // On conserve le résultat
                newtable.push(new Vec2(Tools.lerp(item.x, siblingItem.x, ratio), Tools.lerp(item.y, siblingItem.y, ratio)));   
            }

            // On switche les tables pour traiter celles avec les résultats les plus récents
            table = newtable;
        }

        // Le dernier point obtenu est la position courante sur la courbe
        this.currentPoint.x = table[0].x;
        this.currentPoint.y = table[0].y;
    }

    getPoint() {
        return this.currentPoint;
    }
    
    getPoints() {
        return this.pointsList;
    }
}
class TweenCurve {
    constructor(duration, originPoint, destinationPoint, tweeningFunction) {
        this.duration = duration;
        this.originPoint = originPoint;
        this.destinationPoint = destinationPoint;
        this.tweeningFunction = tweeningFunction;
        this.elapse = 0;
        this.currentPoint = new Vec2(this.originPoint.x, this.originPoint.y);
    }

    reset() {
        this.elapse = 0;
    }

    isEnded() {
        return this.elapse >= this.duration;
    }

    getClone() {
        return new TweenCurve(this.duration, this.originPoint, this.destinationPoint, this.tweeningFunction);
    }

    rotatePoint(point, origin, angle) {
        let newAngle = Math.atan2(point.y - origin.y, point.x - origin.x) + angle;
        let longueur = Tools.distance(point, origin);
        return new Vec2(origin.x + longueur * Math.cos(newAngle), origin.y + longueur * Math.sin(newAngle));
    }

    rotate(angle, origine = null) {
        let point = new Vec2();
        if (origine == null) {
            point.x = originPoint.x;
            point.y = originPoint.y;
        }
        else {
            originPoint = this.rotatePoint(originPoint, origine, angle);
            point.x = origine.x;
            point.y = origine.y;
        }

        this.destinationPoint = this.rotatePoint(destinationPoint, point, angle);
    }

    update(dt) {
        // Ou en est-on dans l'avancement sur la trajectoire
        this.elapse += dt;
        let ratio = Tools.clamp(this.elapse / this.duration, 0, 1);

        // On démarre avec la liste complète

        // Le dernier point obtenu est la position courante sur la courbe
        this.currentPoint.x = this.tweeningFunction(ratio) * (this.destinationPoint.x - this.originPoint.x) + this.originPoint.x;
        this.currentPoint.y = this.tweeningFunction(ratio) * (this.destinationPoint.y - this.originPoint.y) + this.originPoint.y;
    }

    getPoint() {
        return this.currentPoint;
    }
    
    getPoints() {
        return [ this.originPoint, this.destinationPoint ];
    }
}
class CompositeCurve {
    constructor(loop = false, number = 0) {
        this.curves = [];
        this.loop = loop;
        this.number = number;
        this.remainingLoop = this.number;
        this.currentCurveIndex = 0;
        this.currentCurve = null;
    }

    getClone() {
        let clone = new CompositeCurve(this.loop, this.number);
        this.curves.forEach(curve => {
            clone.addCurve(curve.getClone());
        });
        return clone;
    }

    addCurve(curve) {
        if (this.currentCurve == null) {
            this.currentCurve = curve;
        }
        this.curves.push(curve);
    }

    isEnded() {
        return this.currentCurveIndex >= this.curves.length;
    }

    reset() {
        this.currentCurveIndex = 0;
        this.currentCurve = this.curves[this.currentCurveIndex];
        this.curves.forEach(curve => {
            curve.reset();
        });
    }

    rotate(angle, origine = null) {
        this.curves.forEach(curve => {
            if (origine == null) {
                origine = curve.getPoints()[0];
            }
            curve.rotate(angle, origine);
        });
    }

    update(dt) {
        if (!this.isEnded()) {
            this.currentCurve.update(dt);
            if (this.currentCurve.isEnded()) {
                this.currentCurveIndex++;
                this.currentCurve = this.curves[this.currentCurveIndex];
                if (this.isEnded()) {
                    if (this.loop) {
                        this.remainingLoop--;
                        if (this.remainingLoop > 0 || this.number == 0) {
                            this.reset();
                            this.currentCurve.update(dt);
                        }
                    }
                }            
                else {
                    this.currentCurve.update(dt);
                }
            }
        }
    }

    getPoint() {
        return this.currentCurve.getPoint();
    }

    getPoints() {
        let points = [];
        this.curves.forEach(curve => {
            points.concat(curve.getPoints());
        });
        return points;
    }
}
class BaseCommand {
    constructor(gameObject) {
        this.gameObject = gameObject;
        this.canExecute = true;
    }

    update(dt) {
    }

    execute() {
    }
}
class SwitchSceneCommand extends BaseCommand {
    constructor(currentScene, targetScene, start) {
        super();
        this.currentScene = currentScene;
        this.targetScene = targetScene;
        this.start = start;
        this.gotoCommand = new GotoSceneCommand(this.targetScene, this.start);
    }

    getClone() {
        return new BackToMenuCommand();
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.currentScene.hide(this.gotoCommand);
        }
    }
}
class GotoSceneCommand extends BaseCommand {
    constructor(targetScene, start) {
        super();
        this.targetScene = targetScene;
        this.start = start;
    }

    getClone() {
        return new GotoSceneCommand(this.targetScene, this.start);
    }

    execute() {
        if (this.canExecute) {
            Services.get("SCENE").setCurrent(this.targetScene, this.start);
        }
    }
}
class CompositeCommand extends BaseCommand {
    constructor() {
        super();
        this.commandsList = [];
    }

    addCommand(command) {
        this.commandsList.unshift(command);
    }

    update(dt) {
        this.commandsList.forEach(command => {
            command.update(dt);
        });
    }

    execute() {
        this.commandsList.forEach(command => {
            command.execute();
        });
    }
}
class DealDamageCommand extends BaseCommand {
    constructor(gameObject, amount) {
        super(gameObject);
        this.amount = amount;
    }

    getClone(gameObject) {
        return new DealDamageCommand(gameObject, this.amount);
    }

    execute(otherGameObject) {
        if (this.canExecute) {
            otherGameObject.damage(this.amount);
        }
    }
}
class TakeDamageCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new TakeDamageCommand(gameObject);
    }

    execute(amount) {
        if (this.canExecute) {
            this.gameObject.damage(amount);
        }
    }
}
class DieCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new DieCommand(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.status = "OUTDATED";
        }
    }
}
class DummyCommand {
    constructor() {
    }

    getClone() {
        return new DummyCommand();
    }

    update(dt) { 
    }

    execute() {
    }
}
class FireActionCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.fireCommand.execute();
        }
    }
}
class MoveCommand extends BaseCommand {
    constructor(gameObject, vector) {
        super(gameObject);
        this.vector = vector;
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.moveStrategy.vector.x += this.vector.x;
            this.gameObject.moveStrategy.vector.y += this.vector.y;
        }
    }
}
class PopCommand extends BaseCommand {
    constructor(gameObject, gameObjectPrototype) {
        super(gameObject);
        this.gameObjectPrototype = gameObjectPrototype;
        this.offset = new Vec2((this.gameObject.size.x - this.gameObjectPrototype.size.x) / 2, (this.gameObject.size.x - this.gameObjectPrototype.size.x) / 2);
    }

    getClone(gameObject) {
        return new PopCommand(gameObject, this.gameObjectPrototype.getClone());
    }

    execute() {
        if (this.canExecute) {
            this.gameObjectPrototype.position.x = this.gameObject.position.x + this.offset.x;
            this.gameObjectPrototype.position.y = this.gameObject.position.y + this.offset.y;
            this.gameObjectPrototype.status = "ACTIVE";
            Services.get("SCENE").currentScene.addGameObject(this.gameObjectPrototype);
        }
    }
}
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
class HidePlayerCommand extends BaseCommand {
    constructor(playerShip) {
        super();
        this.playerShip = playerShip;
    }

    getClone() {
        return new HidePlayerCommand(this.playerShip);
    }

    execute() {
        if (this.canExecute) {
            this.playerShip.globalAlpha = 0;
            this.playerShip.moveStrategy = new DummyMoveStrategy();;
        }
    }
}
class SpeedBonusCommand extends BaseCommand {
    constructor(gameObject, speedBonus) {
        super(gameObject);
        this.speedBonus = speedBonus;
    }

    getClone() {
        return new SpeedBonusCommand(this.gameObject, this.speedBonus);
    }

    execute() {
        if (this.canExecute) {
            Services.get("ASSET").get("Sounds/Correct_06_wav.wav").play();
            this.gameObject.speed += this.speedBonus;
        }
    }
}
class ShowPanelCommand extends BaseCommand {
    constructor(panel) {
        super();
        this.panel = panel;
    }

    getClone() {
        return new ShowPanelCommand(this.panel);
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.panel.show();
        }
    }
}
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
class WeaponBonusCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new WeaponBonusCommand(gameObject);
    }

    execute() {
        if (this.canExecute) {
            Services.get("ASSET").get("Sounds/Correct_08_wav.wav").play();
            let weapon = Services.get("SCENE").currentScene.playerShip.fireCommand.weapon;
            if (weapon.currentLevel() == 5) {
                this.gameObject.life = this.gameObject.maxLife;
            }
            else {
                Services.get("SCENE").currentScene.playerShip.fireCommand.weapon.levelUp();
            }
        }
    }
}
class LifeBonusCommand extends BaseCommand {
    constructor(gameObject, lifeBonus) {
        super(gameObject);
        this.lifeBonus = lifeBonus;
    }

    getClone() {
        return new LifeBonusCommand(this.gameObject, this.lifeBonus);
    }

    execute() {
        if (this.canExecute) {
            Services.get("ASSET").get("Sounds/Correct_06_wav.wav").play();
            this.gameObject.life += this.lifeBonus;
            this.gameObject.life = Tools.clamp(this.gameObject.life, 0, this.gameObject.maxLife);
        }
    }
}
class HidePanelCommand extends BaseCommand {
    constructor(panel) {
        super();
        this.panel = panel;
    }

    getClone() {
        return new ShowPanelCommand(this.panel);
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.panel.hide();
        }
    }
}
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
class SpeedBonusCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.sound = Services.get("ASSET").get("Sounds/Click_Digital_10_wav.wav");
    }

    getClone(gameObject) {
        return new SpeedBonusCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.canExecute = false;
            this.sound.play();
            // On donne une moveStrategy au bonus

            let pt0 = this.gameObject.position;
            let pt3 = Services.get("SCENE").currentScene.playerShip.hud.getNextSpeedBonusPosition();
            pt3.x -= this.gameObject.size.x / 2 - 16;
            pt3.y -= this.gameObject.size.y / 2 - 16 ;

            this.gameObject.moveStrategy = new BezierApexMoveStrategy(this.gameObject, new TweenCurve(1, pt0, pt3, Easing.easeInOutCubic));
            this.gameObject.layer = 2;
        }
    }
}
class WeaponBonusCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Click_Digital_10_wav.wav"), 5);
    }

    getClone(gameObject) {
        return new WeaponBonusCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.canExecute = false;
            this.sound.play();
            // On donne une moveStrategy au bonus

            let pt0 = this.gameObject.position;
            let pt3 = Services.get("SCENE").currentScene.playerShip.hud.getNextWeaponBonusPosition();
            pt3.x -= this.gameObject.size.x / 2 - 16;
            pt3.y -= this.gameObject.size.y / 2 - 16;

            this.gameObject.moveStrategy = new BezierApexMoveStrategy(this.gameObject, new TweenCurve(1, pt0, pt3, Easing.easeInOutCubic));
            this.gameObject.layer = 2;
        }
    }
}
class LifeBonusCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Click_Digital_10_wav.wav"), 5);
    }

    getClone(gameObject) {
        return new LifeBonusCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.canExecute = false;
            this.sound.play();

            // On donne une moveStrategy au bonus

            let pt0 = this.gameObject.position;
            let pt3 = new Vec2(82, 106);
            pt3.x -= this.gameObject.size.x / 2;
            pt3.y -= this.gameObject.size.y / 2;

            this.gameObject.moveStrategy = new BezierApexMoveStrategy(this.gameObject, new TweenCurve(1, pt0, pt3, Easing.easeInOutCubic));
            this.gameObject.layer = 2;
        }
    }
}
class MissileCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new MissileCollideCommand(gameObject);
    }

    execute(otherGameObject) {
        if (this.canExecute && (otherGameObject.type == "SHIP" || otherGameObject.type == "WALL")) {
            switch(otherGameObject.type) {
                case "SHIP":
                    this.gameObject.dealDamageCommand.execute(otherGameObject);
                    this.gameObject.dieCommand.execute();
                    break;
                case "WALL":
                    this.gameObject.dieCommand.execute();
                    break;
            }
            this.canExecute = false;
        }
    }
}
class ShipCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.collideTtl = this.maxCollideTtl = 1; 
    }

    getClone(gameObject) {
        return new ShipCollideCommand(gameObject);
    }

    update(dt) {
        if (this.collideTtl > 0) {
            this.collideTtl -= dt;
            this.collideTtl = this.collideTtl <= 0 ? 0 : this.collideTtl;
        }
        this.canExecute = this.collideTtl == 0;
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.collideTtl = this.maxCollideTtl;
            this.gameObject.dealDamageCommand.execute(otherGameObject);
        }
    }
}
class WallCollideCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.collideTtl = this.maxCollideTtl = 1; 
    }

    getClone(gameObject) {
        return new WallCollideCommand(gameObject);
    }
    
    update(dt) {
        if (this.collideTtl > 0) {
            this.collideTtl -= dt;
            this.collideTtl = this.collideTtl <= 0 ? 0 : this.collideTtl;
        }
        this.canExecute = this.collideTtl == 0;
    }

    execute(otherGameObject) {
        if (this.canExecute && otherGameObject.type == "SHIP") {
            this.gameObject.dealDamage.execute(otherGameObject);
        }
    }
}
class AsapFireCommand extends BaseCommand {
    constructor(command) {
        super();
        this.command = command;
    }

    getClone(gameObject) {
        return new AsapFireCommand(this.command.getClone(gameObject));
    }

    update(dt) {
        this.command.update(dt);
        if (this.command.canExecute) {
            this.command.execute();
        }
    }
}

class FireRatedFireCommand extends BaseCommand {
    constructor(gameObject, prototype, startingPoint, fireRate, sound = null) {
        super(gameObject);
        this.prototype = prototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = Math.random() * this.fireRate;
        this.sound = sound;
    }

    update(dt) {
        if (this.fireRateTtl > 0){
            this.fireRateTtl -= dt;
            if (this.fireRateTtl < 0) {
                this.fireRateTtl = 0;
            }
        }
        this.canExecute = this.fireRateTtl == 0;
    }

    execute() {
        if (this.canExecute) {
            this.fireRateTtl = this.fireRate;
            if (this.sound != null) {
                this.sound.play();
            }
            let clone = this.prototype.getClone();
            clone.position.x = this.gameObject.position.x + (this.gameObject.size.x - clone.size.x) / 2 + this.startingPoint.x;
            clone.position.y = this.gameObject.position.y + (this.gameObject.size.y - clone.size.y) / 2 + this.startingPoint.y;
            Services.get("SCENE").currentScene.addGameObject(clone);
        }
    }   
}
class RandomizedFireRatedFireCommand extends BaseCommand {
    constructor(gameObject, prototype, startingPoint, fireRate) {
        super(gameObject);
        this.prototype = prototype;
        this.startingPoint = startingPoint;
        this.fireRate = fireRate;
        this.fireRateTtl = 0;
    }

    update(dt) {
        if (this.fireRateTtl > 0){
            this.fireRateTtl -= dt;
            if (this.fireRateTtl < 0) {
                this.fireRateTtl = 0;
            }
        }
        this.canExecute = this.fireRateTtl == 0;
    }

    execute() {
        if (this.canExecute) {
            this.fireRateTtl = this.fireRate * (0.9 + Math.random() * 0.2);

            let clone = this.prototype.getClone();
            clone.position.x = this.gameObject.position.x + (this.gameObject.size.x - clone.size.x) / 2 + this.startingPoint.x;
            clone.position.y = this.gameObject.position.y + (this.gameObject.size.y - clone.size.y) / 2 + this.startingPoint.y;
            Services.get("SCENE").currentScene.addGameObject(clone);
        }
    }   
}
class WeaponFireCommand extends BaseCommand {
    constructor(gameObject, weapon) {
        super(gameObject);
        this.weapon = weapon;
    }

    getName() {
        return this.weapon.getName();
    }

    update(dt) {
        this.weapon.update(dt);
    }

    execute() {
        this.weapon.fire();
    }
}

class BaseMultiBulletFireCommand extends CompositeCommand {
    constructor(gameObject, fireRate, sound) {
        super();
        this.gameObject = gameObject;
        this.fireRateTtl = this.fireRate = fireRate;
        this.frontAngle = Math.PI / 12;        
        this.rearAngle = Math.PI / 6;       
        this.sound = sound; 
    }

    execute() {
        if (this.commandsList[0].canExecute) {
            this.sound.play();
            super.execute();
        }
    }
}
class Level1BulletFireCommand extends BaseMultiBulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level1BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}
class Level2BulletFireCommand extends BaseMultiBulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject, -Math.PI / 36, new Vec2(0, -10)), new Vec2(), this.fireRate));
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject, Math.PI / 36, new Vec2(0, -10)), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level2BulletFireCommand(gameObject, this.fireRate, sound);
    }
}
class Level3BulletFireCommand extends Level2BulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.command = new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(this.gameObject, Math.PI, new Vec2(-this.gameObject.size.x, 0)), new Vec2(), this.fireRate);
        this.addCommand(this.command);
        this.baseAngle = Math.PI;
        this.angle = Math.PI;
        this.angleAmplitude = Math.PI / 4;
        this.angleSpeed = 0.25;
    }

    update(dt) {
        super.update(dt);
        this.angle += this.angleSpeed * dt;
        if ((this.angle > this.baseAngle + this.angleAmplitude) || (this.angle < this.baseAngle - this.angleAmplitude)) {
            this.angleSpeed *= -1;
        }
        this.angle = Tools.clamp(this.angle, this.baseAngle - this.angleAmplitude, this.baseAngle + this.angleAmplitude);
        this.command.prototype = new WeaponBlueBulletGameObject(this.gameObject, this.angle, new Vec2(-this.gameObject.size.x / 2, -10));
    }

    getClone(gameObject) {
        return new Level3BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}
class Level4BulletFireCommand extends Level2BulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(this.gameObject, 7 * Math.PI / 6, new Vec2(-this.gameObject.size.x, 0)), new Vec2(), this.fireRate));
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(this.gameObject, 5 * Math.PI / 6, new Vec2(-this.gameObject.size.x, 0)), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level4BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}
class Level5BulletFireCommand extends Level4BulletFireCommand {
    constructor(gameObject, fireRate, sound) {
        super(gameObject, fireRate, sound);  
        this.addCommand(new RandomizedFireRatedFireCommand(this.gameObject, new WeaponBlueBulletGameObject(gameObject, 0, new Vec2(0, -10)), new Vec2(), this.fireRate));
    }

    getClone(gameObject) {
        return new Level5BulletFireCommand(gameObject, this.fireRate, this.sound);
    }
}

class BaseStrategy {
    constructor(gameObject) {
        this.gameObject = gameObject;        
    }

    update(dt) {

    }
}
class BaseMoveStrategy extends BaseStrategy {
    constructor(gameObject, initialVector = new Vec2()) {
        super(gameObject);
        this.initialVector = Tools.normalize(initialVector);
        this.vector = new Vec2();
    }

    getClone(gameObject) {
        return new BaseMoveStrategy(gameObject, this.initialVector.getClone());
    }

    update(dt) {
        // On applique les mouvements demandés
        this.vector = Tools.normalize(this.vector);   
        this.gameObject.position.x += this.vector.x * this.gameObject.speed * dt;
        this.gameObject.position.y += this.vector.y * this.gameObject.speed * dt;    
    }
}
class BezierApexMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, curve) {
        super(gameObject, new Vec2(1));   
        this.curve = curve;
    }

    getClone(gameObject) {
        return new BezierApexMoveStrategy(gameObject, this.curve.getClone());
    }

    rotate(angle) {
        this.curve.rotate(angle);
    }

    update(dt) {
        this.curve.update(dt);
        if (this.gameObject.status == "ACTIVE" && this.curve.isEnded()) {
            this.gameObject.dieCommand.execute();
            // this.gameObject.status = GameObjectState.OUTDATED;
        }
        else {
            let nextPoint = this.curve.getPoint();
            this.gameObject.position.x = nextPoint.x;
            this.gameObject.position.y = nextPoint.y;
        }
    }
}

class RocketApexMoveStrategy extends BezierApexMoveStrategy {
    constructor(gameObject) {
        let screen = Services.get("SCREEN");

        // Le point de départ est le museau du vaisseau
        let departurePoint = new Vec2(gameObject.position.x + gameObject.size.x, gameObject.position.y + gameObject.size.y / 2);

        // Le point d'arrivée est toujours le bord de l'écran
        let arrivalPoint = new Vec2(screen.width + 100, gameObject.position.y + gameObject.size.y / 2);

        // On calcule 2 points aléatoires proches de la trajectoire rectiligne
        // le 1er dans les 10 premiers %, mais assez éloigné en hauteur
        // On choisit le sens en hauteur, pour l'inverser sur le second point
        let pt1 = new Vec2(Math.random() * (screen.width - gameObject.position.x) * 0.1 + gameObject.position.x, gameObject.position.y + gameObject.size.y / 2 + 10 * gameObject.size.y * (Math.random() - 0.5));

        // le second dans le 3eme quarts, mais assez proche en hauteur
        let distanceToBound = screen.width - gameObject.position.x;
        let pt2 = new Vec2(Math.random() * distanceToBound / 4 + gameObject.position.x + distanceToBound / 2, gameObject.position.y + gameObject.size.y / 2 + 10 * (Math.random() - 0.5) * gameObject.size.y);

        super(gameObject, new Curve(departurePoint, pt1, pt2, arrivalPoint, distanceToBound / gameObject.speed));
    }
    
    getClone(gameObject) {
        return new RocketApexMoveStrategy(gameObject);
    }
}
class PlayerEntranceMoveStrategy extends BezierApexMoveStrategy {
    constructor(gameObject) {
        let pt0 = new Vec2(-64, 0);
        let pt1 = new Vec2(1236, 0);
        let pt2 = new Vec2(1236, 736);
        let pt3 = new Vec2(640, 736);

        let pt5 = new Vec2(0, 736);
        let pt6 = new Vec2(0, 368);
        let pt7 = new Vec2(608, 368);

        let curve = new CompositeCurve(false);
        curve.addCurve(new TweenCurve(2, pt0, pt0, Easing.easeInOutCubic));
        curve.addCurve(new BezierCurve(2, [ pt0, pt1, pt2, pt3 ]));
        curve.addCurve(new BezierCurve(2, [ pt3, pt5, pt6, pt7 ]));

        super(gameObject, curve);   
        this.started = false;
    }

    getClone(gameObject) {
        return new PlayerEntranceMoveStrategy(gameObject);
    }

    update(dt) {
        this.curve.update(dt);

        if (!this.started && this.curve.curves[0].isEnded()) {
            this.started = true;
            Services.get("ASSET").get("Sounds/Stinger_v2_wav.wav").play();
        }

        if (this.curve.isEnded()) {
            this.gameObject.flashLayer.show();
            this.gameObject.damageSound.play();
            this.gameObject.moveStrategy = new PlayerControlledMoveStrategy(this.gameObject);
        }
        else {
            let nextPoint = this.curve.getPoint();
            this.gameObject.position.x = nextPoint.x;
            this.gameObject.position.y = nextPoint.y;    
        }
    }
}
class DummyMoveStrategy extends BaseStrategy {
    constructor(gameObject) {
        super(gameObject);
    }

    getClone(gameObject) {
        return new DummyMoveStrategy(gameObject);
    }

    update(dt) {
    }
}
class MouseControlledMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject) {
        super(gameObject);
    }

    update(dt) {
        // On se place sur les coordonnées de la souris
        let inputListener = Services.get("INPUT");
        this.gameObject.position.x = inputListener.mouse.x;
        this.gameObject.position.y = inputListener.mouse.y;
    }
}
class PlayerControlledMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector = new Vec2()) {
        super(gameObject, initialVector);
    }

    update(dt) {
        // Initialisation du mouvement
        this.vector.x = this.vector.y = 0;

        // On exécute toutes les commandes demandées par le joueur
        let commands = Services.get("INPUT").handleInput();
        for (let index = 0, len = commands.length; index < len; index++) {
            const command = commands[index];
            command.execute();
        }

        // Application des mouvements demandés
        super.update(dt);

        // On contrôle qu'il ne soit pas hors de l'écran
        let screen = Services.get("SCREEN");
        this.gameObject.position.x = Tools.clamp(this.gameObject.position.x, 0, screen.width - this.gameObject.size.x);
        this.gameObject.position.y = Tools.clamp(this.gameObject.position.y, 0, screen.height - this.gameObject.size.y);
    }
}
class SinWaveMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector, amplitude, initialDt = 0) {
        super(gameObject, initialVector);        
        this.amplitude = amplitude;
        this.totalDt = initialDt;
    }

    getClone(gameObject) {
        return new SinWaveMoveStrategy(gameObject, this.initialVector.getClone(), this.totalDt);
    }

    update(dt) {
        // Avancement dans le temps
        this.totalDt += dt;

        // Le déplacement en x est linéaire
        this.vector.x = this.initialVector.x * this.amplitude;

        // Le déplacement vertical est sinusoidal
        this.vector.y = this.initialVector.y + Math.sin(this.totalDt) * this.amplitude;

        // Application du mouvement
        super.update(dt);

        if (this.gameObject.status == "ACTIVE" && Tools.isOutOfScreen(this.gameObject.position, this.gameObject.size)) {
            this.gameObject.status = "OUTDATED";
        }
    }
}
class UniformMoveStrategy extends BaseMoveStrategy {
    constructor(gameObject, initialVector) {
        super(gameObject, initialVector);   
    }

    getClone(gameObject) {
        return new UniformMoveStrategy(gameObject, this.initialVector.getClone());
    }

    rotate(angle) {
        let newAngle = Math.atan2(-this.initialVector.y, -this.initialVector.x) + angle;
        this.initialVector.x = Math.cos(newAngle);
        this.initialVector.y = Math.sin(newAngle);
    }

    update(dt) {
        this.vector.x = this.initialVector.x * dt;
        this.vector.y = this.initialVector.y * dt;

        super.update(dt);

        if (this.gameObject.status == "ACTIVE" && Tools.isOutOfScreen(this.gameObject.position, this.gameObject.size)) {
            this.gameObject.status = "OUTDATED";
        }
    }
}
class PlayerAimedUniformMoveStrategy extends UniformMoveStrategy {
    constructor(gameObject, origine, playerShip) {
        let fireAngle = Math.atan2(playerShip.position.y + playerShip.size.y / 2 - (origine.position.y + origine.size.y / 2), playerShip.position.x + playerShip.size.x / 2 - (origine.position.x + origine.size.x / 2));
        super(gameObject, new Vec2(Math.cos(fireAngle), Math.sin(fireAngle)));   
        this.origine = origine;
        this.playerShip = playerShip;
    }

    getClone(gameObject) {
        return new PlayerAimedUniformMoveStrategy(gameObject, this.origine, this.playerShip);
    }
}
class AtomGameObject extends EnemyShipGameObject {
    constructor() {
        // Paramétrage du vaisseau ennemi
        super(Services.get("ASSET").get("Images/atom.png"), new Vec2(64), 5000, 100, Services.get("ASSET").get("Images/atom2.png"))
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 800);
        this.fireCommand = new AsapFireCommand(new AtomBulletWave(this));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 2);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav").cloneNode()));
    }
            
    getClone() {
        return new AtomGameObject();
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }
}
class AtomBulletWave extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
        this.AllInCircleSpawnerTtl = Math.random() * 2 + 2;
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/laser1.mp3"), 5);
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.AllInCircleSpawnerTtl -= dt;
        this.canExecute = this.AllInCircleSpawnerTtl < 0;
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.AllInCircleSpawnerTtl = 4;
            this.sound.play();
            this.AllInCircleSpawnerGameObject = new AllInCircleSpawnerGameObject(new RedBulletGameObject(this.gameObject.partition, new Vec2(), Math.random() * 75 + 50), this.gameObject, 8, 0);
            this.AllInCircleSpawnerGameObject.spawn();
        }
    }
}
class CubeGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        // Paramétrage du vaisseau ennemi
        super(Services.get("ASSET").get("Images/cube.png"), new Vec2(64), 200, 0, Services.get("ASSET").get("Images/cube2.png"))
        this.playerShip = playerShip;
        this.layer = 0.99;
        this.moveStrategy = new DummyMoveStrategy();
        this.bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        this.bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(this.bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, this.bulletPrototype, new Vec2(), Math.random() * 3 + 2, new SoundPool(Services.get("ASSET").get("Sounds/laser6.mp3"), 5)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 100 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 1);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav").cloneNode()));
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }          

    getClone() {
        let clone = new CubeGameObject(this.playerShip);
        this.bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        this.bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(this.bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, this.bulletPrototype, new Vec2(), 5));
        return clone;
    }
}

class TimedCubeGameObject extends CubeGameObject {
    constructor(playerShip) {
        // Paramétrage du vaisseau ennemi
        super(playerShip)
        this.ttl = 20;
    }
            
    getClone() {
        let clone = new TimedCubeGameObject(this.playerShip);
        this.bulletPrototype = new BlueBulletGameObject(this.partition, new Vec2());
        this.bulletPrototype.moveStrategy = new PlayerAimedUniformMoveStrategy(this.bulletPrototype, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, this.bulletPrototype, new Vec2(), 5));
        return clone;
    }

    update(dt) {
        super.update(dt);
        this.ttl -= dt;
        if (this.ttl < 0) {
            this.dieCommand.execute();
        }
    }
}

class KlawGameObject extends EnemyShipGameObject {
    static getAnimatedSprite() {
        let sprite = new AnimatedSprite(Services.get("ASSET").get("Images/klaw.png"), new Vec2(256, 256));
        sprite.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47], 50 / 1000, true));
        sprite.startAnimation("IDLE", 0);
        return sprite;
    }
}

class RockyDecorImage {
    constructor() {
        let resources = Services.get("ASSET");

        let image1 = resources.get("Images/rock7.png")
        let image2 = resources.get("Images/rock11.png")
        let image3 = resources.get("Images/rock8.png")
        let image4 = resources.get("Images/rock9.png")
        let image5 = resources.get("Images/rock10.png")

        let totalWidth = image1.width + image2.width + image3.width + image4.width + image5.width;
        let maxHeight = Math.max(image1.height, image2.height, image3.height, image4.height, image5.height)
        let imageX = 0;

        // Constitution d'une image intermédiaire pour une manipulation unique de l'ensemble
        let imageAssembler = new ImageHandler(new Vec2(totalWidth, maxHeight), new Vec2(1, 1));
        imageAssembler.addImage(image1, new Vec2(imageX, maxHeight - image1.height));
        imageX += image1.width;
        imageAssembler.addImage(image2, new Vec2(imageX, maxHeight - image2.height));
        imageX += image2.width;
        imageAssembler.addImage(image3, new Vec2(imageX, maxHeight - image3.height));
        imageX += image3.width;
        imageAssembler.addImage(image4, new Vec2(imageX, maxHeight - image4.height));
        imageX += image4.width;
        imageAssembler.addImage(image5, new Vec2(imageX, maxHeight - image5.height));

        // On récupère le résultat
        imageAssembler.assemble();
        this.image = imageAssembler.getAssembledImage();
    }
}
class Soil1DecorImage {
    static createInstance() {
        let resources = Services.get("ASSET");

        let soil1 = resources.get("Images/soil1.png")
        let soil2 = resources.get("Images/soil2.png")
        let soil3 = resources.get("Images/soil3.png")
        let soil4 = resources.get("Images/soil4.png")

        let tech_bottom_end_left = resources.get("Images/tech_bottom_end_left.png")
        let tech_bottom_end_right = resources.get("Images/tech_bottom_end_right.png")
        let tech_bottom_tile = resources.get("Images/tech_bottom_tile.png")
        let tech_bottom_tile2 = resources.get("Images/tech_bottom_tile2.png")
        
        let totalSize = new Vec2(tech_bottom_end_left.width + soil1.width + soil3.width + soil4.width + tech_bottom_end_right.width, 
            soil2.height + soil3.height + tech_bottom_tile.height);
        // Constitution d'une image intermédiaire pour une manipulation unique de l'ensemble
        let imageAssembler = new ImageHandler(totalSize, new Vec2(1, 1));

        let imageCoord = new Vec2(tech_bottom_end_left.width, soil1.height);

        // On pose les soils
        imageAssembler.addImage(soil1, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageCoord.x += soil1.width;
        imageAssembler.addImage(soil2, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageCoord.y += soil1.height;
        imageAssembler.addImage(soil3, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));
        imageCoord.x += soil2.width;
        imageCoord.y = soil4.height;
        imageAssembler.addImage(soil4, new Vec2(imageCoord.x, totalSize.y - imageCoord.y));

        // On pose les décorations
        imageAssembler.addImage(tech_bottom_end_left, new Vec2(0, totalSize.y - tech_bottom_end_left.height));
        imageAssembler.addImage(tech_bottom_end_left, new Vec2(tech_bottom_end_left.width, totalSize.y - tech_bottom_end_left.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile, new Vec2(2 * tech_bottom_end_left.width, totalSize.y - tech_bottom_tile.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile2, new Vec2(2 * tech_bottom_end_left.width + tech_bottom_tile.width, totalSize.y - tech_bottom_tile.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile, new Vec2(2 * tech_bottom_end_left.width + 2 * tech_bottom_tile.width, totalSize.y - tech_bottom_tile.height - soil1.height));
        imageAssembler.addImage(tech_bottom_tile2, new Vec2(2 * tech_bottom_end_left.width + 3 * tech_bottom_tile.width, totalSize.y - tech_bottom_tile.height - soil1.height));

        // On récupère le résultat
        imageAssembler.assemble();

        return imageAssembler.getAssembledImage();
    }
}
class GreenExplosionGameObject extends ExplosionGameObject {
    constructor(speed) {
        super(Services.get("ASSET").get("Images/greenspark.png"), new Vec2(100), speed);
    }
            
    getClone() {
        return new GreenExplosionGameObject();
    }
}
class MediumGreenExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/greenspark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumGreenExplosionGameObject(this.speed);
    }
}
class GreenSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/greenspark.png"));
    }
                
    getClone() {
        return new GreenSparkGameObject();
    }
}
class Background1GameObject extends RollingLayer {
    constructor(baseSpeed) {
        super(0.1, baseSpeed, Services.get("ASSET").get("Images/background1.png"), new Vec2(-1, 0))
    }
}
class BlackStaticBackgroundGameObject extends StaticLayer {
    constructor() {
        let shape = new RectShape("Black");
        shape.position = new Vec2(0, 0);
        let screen = Services.get("SCREEN");
        shape.size = new Vec2(screen.width, screen.height);
        super(0, shape)
    }
}
class Player1ShipGameObject extends PlayerShipGameObject {
    constructor(initialPosition) {
        super(Services.get("ASSET").get("Images/player1.png"), new Vec2(64), initialPosition)
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new MediumRedExplosionGameObject(100), new RedExplosionGameObject(75) ])));

        // Flash blanc lorsque l'on est touché
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, screen.width, screen.height);
        this.flashLayer = new FlashingLayer(canvas);
        this.damageSound = new SoundPool(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_wav.wav"), 5);

        this.shieldSprite = new Sprite(Services.get("ASSET").get("Images/shield.png"));
        this.invincible = false;
        this.invincibleMaxTtl = 2;
        this.invincibleTtl = 0;
        this.visible = true;
    }
                    
    getClone() {
        return new Player1ShipGameObject(initialPosition.getClone());
    }

    getName() {
        return "Rareoy Ardeas";
    }

    damage(amount) {
        if (!this.invincible) {
            super.damage(amount);
            this.damageSound.play();
            this.flashLayer.show();
            this.invincible = true;
            this.invincibleTtl = this.invincibleMaxTtl;
        }
    }

    update(dt) {
        super.update(dt);
        if (this.invincibleTtl > 0) {
            this.invincibleTtl -= dt;
            if (this.invincibleTtl < 0) {
                this.invincibleTtl = 0;
                this.invincible = false;
            }
        }
        this.shieldSprite.position.x = this.position.x - 30;
        this.shieldSprite.position.y = this.position.y - 30;
    }

    draw(context) {
        // On connect toutes les bullets dans un rayon déterminé
        context.save();
        context.strokeStyle = "#43CCFF";
        context.lineWidth = 1;
        context.globalAlpha = 0.2;
        let currentScene = Services.get("SCENE").currentScene;
        currentScene.gameObjectsCollection.forEach(bullet => {
            if (bullet.type == "MISSILE" && bullet.partition == this.partition && bullet.status == "ACTIVE") {
                let newCollideBox = new CircleCollideBox(new Vec2(bullet.position.x + bullet.size.x / 2 - 80, bullet.position.y + bullet.size.y / 2 - 80), 160);
                currentScene.quadTree.getCandidates(newCollideBox).forEach(otherBullet => {
                    if (bullet.type == otherBullet.type 
                        && bullet.partition == otherBullet.partition 
                        && otherBullet.status == "ACTIVE"
                        && Tools.distance(newCollideBox.position, this.position) > 60
                        && newCollideBox.collide(otherBullet.collideBox)) {
                        // On trace un trait entre les 2 centres
                        context.beginPath();
                        context.moveTo(newCollideBox.position.x + newCollideBox.size.x / 2 - 80, newCollideBox.position.y + newCollideBox.size.y / 2 - 80);
                        context.lineTo(otherBullet.collideBox.position.x + otherBullet.collideBox.radius, otherBullet.collideBox.position.y + 1.5 * otherBullet.collideBox.radius);
                        context.stroke();
                    }
                });
            }            
        });        
        context.restore();
        if (this.invincible) {
            context.save();
            context.globalAlpha = this.invincibleTtl / this.invincibleMaxTtl;
            this.shieldSprite.draw(context);
            context.restore();
        }
        super.draw(context);
    }
}
class Player1ShipMiniatureGameObject extends AnimatedSprite {
    constructor() {        
        let miniature = ImageHandler.zoomImage(Services.get("ASSET").get("Images/player1.png"), new Vec2(1));
        super(miniature, new Vec2(64))
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}
class Player2ShipGameObject extends PlayerShipGameObject {
    constructor(initialPosition) {
        super(Services.get("ASSET").get("Images/player2.png"), new Vec2(64), initialPosition)
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 100 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
                        
    getClone() {
        return new Player2ShipGameObject(initialPosition.getClone());
    }
}
class BlueBulletGameObject extends BulletGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(Services.get("ASSET").get("Images/bluebullet.png"), new Vec2(32), partition, direction, 450, 200);
        this.dieCommand.addCommand(new PopCommand(this, new BlueExplosionGameObject()));
    }

    getClone() {
        let clone = new BlueBulletGameObject(this.partition, this.direction.getClone());
        clone.moveStrategy = this.moveStrategy.getClone(clone);
        return clone;
    }
}
class WeaponBlueBulletGameObject extends BlueBulletGameObject {
    constructor(playerShip, angle = 0, offset = new Vec2()) {
        super(playerShip.partition, new Vec2());
        this.speed = this.speed * (0.8 + Math.random() * 0.4);
        this.playerShip = playerShip;
        this.angle = angle;
        this.offset = offset;
        let pt1Abscisse = this.angle > Math.PI / 2 || this.angle < 3 * Math.PI / 2 ? -100 : 100;
        let pt0 = new Vec2(this.playerShip.position.x + this.playerShip.size.x / 2 + this.offset.x, this.playerShip.position.y + this.playerShip.size.y / 2 + this.offset.y);
        let pt1 = new Vec2(pt0.x + 50 * (Math.random() - 0.5), pt0.y + pt1Abscisse * (Math.random() - 0.5));
        let pt2 = new Vec2(pt0.x + Services.get("SCREEN").width * Math.cos(this.angle), pt0.y +  Services.get("SCREEN").width * Math.sin(this.angle));
        this.moveStrategy = new BezierApexMoveStrategy(this, new BezierCurve(1.2, [ pt0, pt1, pt2 ]))
    }

    getClone() {
        return new WeaponBlueBulletGameObject(this.playerShip, this.angle, this.offset);
    }
}

class GreenBulletGameObject extends BulletGameObject {
    constructor(gameObject, moveStrategy = null) {
        super(Services.get("ASSET").get("Images/greenbullet.png"), new Vec2(32), gameObject.partition, new Vec2(), 400, 150);
        this.gameObject = gameObject;
        this.moveStrategy = moveStrategy;
        this.dieCommand.addCommand(new PopCommand(this, new GreenExplosionGameObject()));
    }
        
    getClone() {
        let clone = new GreenBulletGameObject(this.gameObject);
        clone.moveStrategy = this.moveStrategy.getClone(clone);
        return clone;
    }
}

class RedBulletGameObject extends BulletGameObject {
    constructor(partition, direction = new Vec2(), speed = 350) {
        // Paramétrage des bullets 
        super(Services.get("ASSET").get("Images/redbullet.png"), new Vec2(32), partition, direction, speed, 100);
        this.dieCommand.addCommand(new PopCommand(this, new RedExplosionGameObject()));
        this.layer = 0.99;
        this.sound = Services.get("ASSET").get("Sounds/laser1.mp3");
    }

    getClone() {
        return new RedBulletGameObject(this.partition, this.direction.getClone(), this.speed);
    }
}

class StarknifeGameObject extends EnemyShipGameObject {
    constructor(initialDt = 0) {
        // Paramétrage du vaisseau ennemi
        super(Services.get("ASSET").get("Images/starknife.png"), new Vec2(64), 400, 250, Services.get("ASSET").get("Images/starknife2.png"))
        this.initialDt = initialDt;
        this.moveStrategy = new SinWaveMoveStrategy(this, new Vec2(-1, 0), 300, this.initialDt);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, new RedBulletGameObject(this.partition, new Vec2(-1, 0), Math.random() * 300 + 300), new Vec2(), Math.random() * 1.5 + 1.5, new SoundPool(Services.get("ASSET").get("Sounds/laser5.mp3"), 15)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 2);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav").cloneNode()));
    }
            
    getClone() {
        return new StarknifeGameObject(this.initialDt);
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }
}

class WobblerGameObject extends EnemyShipGameObject {
    constructor(playerShip) {
        super(Services.get("ASSET").get("Images/wobbler.png"), new Vec2(64), 600, 200, Services.get("ASSET").get("Images/wobbler2.png"));
        this.playerShip = playerShip;
        this.moveStrategy = new BezierApexMoveStrategy(this, new WobblerCurve());
        let bullet = new GreenBulletGameObject(this);
        bullet.moveStrategy = new PlayerAimedUniformMoveStrategy(bullet, this, this.playerShip);
        this.fireCommand = new AsapFireCommand(new FireRatedFireCommand(this, bullet, new Vec2(), Math.random() * 2 + 2, new SoundPool(Services.get("ASSET").get("Sounds/laser4.mp3"), 10)));
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 60 / 1000, true));
        this.startAnimation("IDLE", 0);
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 2);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav").cloneNode()));
    }
                
    getClone() {
        return new WobblerGameObject(this.playerShip);
    }

    damage(amount) {
        super.damage(amount);
        this.sound.play();
    }
}
class WobblerCurve extends BezierCurve {
    constructor() {
        // Points caractéristiques de la courbe
        let screen = Services.get("SCREEN");
        let pt1 = new Vec2(-screen.width / 4, screen.height - 64);
        let pt2 = new Vec2(screen.width * 1.3, screen.height);
        let pt3 = new Vec2(screen.width * 1.3, 0);
        let pt4 = new Vec2(-screen.width / 4, 0);

        super(8, [ pt1, pt2, pt3, pt4 ]);
    }
}
class BlueSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/bluespark.png"));
    }
    
    getClone() {
        return new BlueSparkGameObject();
    }
}
class BlueExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get("ASSET").get("Images/bluespark.png"), new Vec2(100), speed);
    }

    getClone() {
        return new BlueExplosionGameObject(this.speed);
    }
}
class MediumBlueExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/bluespark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumBlueExplosionGameObject(this.speed);
    }
}
class SpeedPowerUpGameObject extends BonusGameObject {
    constructor(gameObject) {
        super(gameObject, new BlueSparkGameObject(), new SpeedUpGameObject(), 75);
        this.dieCommand.addCommand(new SpeedBonusCommand(this.gameObject, 50));
        this.dieCommand.addCommand(new UpdatePlayerHudSpeedCommand(this.gameObject));
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new BlueExplosionGameObject(75) ])));
        this.collideCommand = new SpeedBonusCollideCommand(this);
    }
        
    getClone() {
        return new SpeedPowerUpGameObject(this.gameObject);
    }
}
class UpdatePlayerHudSpeedCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.hud.addSpeedBonus();
        }
    }
}
class SpeedUpGameObject extends AnimatedSprite {
    constructor() {
        super(Services.get("ASSET").get("Images/speedpowerup.png"), new Vec2(64))
        this.layer = 1;
        this.partition = "GAME_PARTITION";
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new SpeedUpGameObject();
    }
}
class MiniSpeedUpGameObject extends AnimatedSprite {
    constructor() {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/speedpowerup.png"), new Vec2(0.5)), new Vec2(32))
        this.layer = 1;
        this.type = "NONE";
        this.partition = "NEUTRAL_PARTITION";
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new MiniSpeedUpGameObject();
    }
}
class WeaponUpGameObject extends AnimatedSprite {
    constructor() {
        super(Services.get("ASSET").get("Images/powerup.png"), new Vec2(64));
        this.partition = "GAME_PARTITION";
        this.layer = 1;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 80 / 1000, true));
        this.startAnimation("IDLE", 0);
        // this.dieCommand.commandsList = [];
    }
            
    getClone() {
        return new WeaponUpGameObject();
    }
}
class MiniWeaponUpGameObject extends AnimatedSprite {
    constructor() {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/powerup.png"), new Vec2(0.5)), new Vec2(32))
        this.layer = 1;
        this.type = "NONE";
        this.partition = "NEUTRAL_PARTITION";
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 80 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new MiniWeaponUpGameObject();
    }
}
class LifePowerUpGameObject extends BonusGameObject {
    constructor(gameObject) {
        super(gameObject, new GreenSparkGameObject(), new LifeUpGameObject(), 75);
        this.dieCommand.addCommand(new LifeBonusCommand(this.gameObject, 200));
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new GreenExplosionGameObject(75) ])));
        this.collideCommand = new LifeBonusCollideCommand(this);
    }

    getClone() {
        return new LifePowerUpGameObject(this.gameObject);
    }
}
class LifeUpGameObject extends AnimatedSprite {
    constructor() {
        super(Services.get("ASSET").get("Images/life.png"), new Vec2(64));
        this.partition = "GAME_PARTITION";
        this.layer = 1;
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 50 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
            
    getClone() {
        return new LifeUpGameObject();
    }
}
class WeaponPowerUpGameObject extends BonusGameObject {
    constructor(gameObject) {
        super(gameObject, new PurpleSparkGameObject(), new WeaponUpGameObject(), 75);
        this.dieCommand.addCommand(new WeaponBonusCommand(this.gameObject));
        this.dieCommand.addCommand(new UpdatePlayerHudWeaponCommand(this.gameObject));
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new PurpleExplosionGameObject(75) ])));
        this.collideCommand = new WeaponBonusCollideCommand(this);
    }

    getClone() {
        return new WeaponPowerUpGameObject(this.gameObject);
    }
}
class UpdatePlayerHudWeaponCommand extends BaseCommand {
    constructor(gameObject) {
        super(gameObject);
    }

    execute() {
        if (this.canExecute) {
            this.gameObject.hud.addWeaponBonus();
        }
    }
}
class RedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get("ASSET").get("Images/redspark.png"), new Vec2(100), speed);
    }
    
    getClone() {
        return new RedExplosionGameObject(this.speed);
    }
}
class PurpleExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 15) {
        super(Services.get("ASSET").get("Images/purplespark.png"), new Vec2(100), speed);
    }
    
    getClone() {
        return new PurpleExplosionGameObject(this.speed);
    }
}
class MediumPurpleExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/purplespark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumRedExplosionGameObject(this.speed);
    }
}
class MediumRedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 30) {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/redspark.png"), new Vec2(2)), new Vec2(200), speed);
    }
    
    getClone() {
        return new MediumRedExplosionGameObject(this.speed);
    }
}
class GiantRedExplosionGameObject extends ExplosionGameObject {
    constructor(speed = 75) {
        super(ImageHandler.zoomImage(Services.get("ASSET").get("Images/redspark.png"), new Vec2(5)), new Vec2(500), speed);
    }
    
    getClone() {
        return new GiantRedExplosionGameObject(this.speed);
    }
}
class ParticlesMediumExplosionGameObject extends GameObject {
    constructor(gameObject, prototypesList) {
        super();
        this.gameObject = gameObject;
        this.spawned = false;
        this.prototypesList = prototypesList;
        this.explosions = [];
        let number = 5;
        this.prototypesList.forEach(prototype => {
            prototype.partition = "NEUTRAL_PARTITION";
            this.createExplosions(number, prototype);
            number = number * 2 + 1;
        });
    }

    createExplosions(maxNumber, explosionPrototype) {
        for (let index = 0; index < maxNumber; index++) {
            let explosion = explosionPrototype.getClone();
            explosion.speed = Math.random() * 3 * explosion.speed / 4 + explosion.speed / 2;
            let angle = Math.random() * 2 * Math.PI;
            explosion.moveStrategy = new UniformMoveStrategy(explosion, new Vec2(Math.cos(angle), Math.sin(angle)));
            explosion.layer = this.gameObject.layer + 1;
            this.explosions.push(explosion);
        }        
    }
    
    getClone(gameObject) {
        return new ParticlesMediumExplosionGameObject(gameObject, this.prototypesList);
    }

    update(dt) {
        this.status = "OUTDATED";

        this.explosions.forEach(explosion => {
            explosion.status = "ACTIVE";
            explosion.position.x = this.gameObject.position.x + (this.gameObject.size.x - explosion.size.x) / 2;
            explosion.position.y = this.gameObject.position.y + (this.gameObject.size.y - explosion.size.y) / 2;
            Services.get("SCENE").currentScene.addGameObject(explosion);
        });
    }
}
class ParticlesThrustGameObject extends GameObject {
    constructor(gameObject, prototype, direction = -1) {
        super();
        this.gameObject = gameObject;
        this.prototype = prototype;
        this.direction = direction;
        this.ttl = this.baseTtl = 0;
        this.lastPosition = new Vec2();
    }
    
    getClone(gameObject) {
        return new ParticlesThrustGameObject(gameObject, this.prototype, this.direction);
    }

    update(dt) {
        this.ttl -= dt;
        if (this.ttl < 0) {
            this.baseTtl = 50 / this.gameObject.speed;
            if (this.gameObject.position.x != this.lastPosition.x || this.gameObject.position.y != this.lastPosition.y) {
                this.ttl = Math.random() * this.baseTtl;
            }
            else {
                this.ttl = (Math.random() + 0.5) * this.baseTtl;
            }
            let explosion = this.prototype.getClone();
            let angle = Math.random() * Math.PI / 2 + Math.PI * (0.25 + this.direction * 0.5);
            explosion.position.x = this.gameObject.position.x + this.direction * explosion.size.x / 2;
            explosion.position.y = this.gameObject.position.y + (this.gameObject.size.y - explosion.size.y) / 2;
            explosion.moveStrategy = new UniformMoveStrategy(explosion, new Vec2(Math.cos(angle), Math.sin(angle)));
            explosion.status = "ACTIVE";
            Services.get("SCENE").currentScene.addGameObject(explosion);
            this.lastPosition.x = this.gameObject.position.x;
            this.lastPosition.y = this.gameObject.position.y;
        }
    }
}
class RedSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/redspark.png"));
    }
        
    getClone() {
        return new RedSparkGameObject();
    }
}
class PurpleSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get("ASSET").get("Images/purplespark.png"));
    }
                            
    getClone() {
        return new PurpleSparkGameObject();
    }
}
class WhiteRocketGameObject extends RocketGameObject {
    constructor(partition, direction) {
        // Paramétrage des bullets 
        super(Services.get("ASSET").get("Images/rocket.png"), new Vec2(32), partition, direction, 500, 200);
        this.dieCommand.addCommand(new PopCommand(this, new RedExplosionGameObject()));
    }
                
    getClone() {
        return new WhiteRocketGameObject(this.partition, this.direction.getClone());
    }
}

class BigSaucerBulletWave extends BaseCommand {
    constructor(bigSaucer) {
        super();
        this.bigSaucer = bigSaucer;
        this.AllInCircleSpawnerTtl = 5;
        this.step = 0;
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/laser1.mp3"), 5);
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.AllInCircleSpawnerTtl -= dt;
        if (this.AllInCircleSpawnerTtl <= 0) {
            this.canExecute = true;
            this.sound.play();
            switch (this.step) {
                case 0:
                    this.AllInCircleSpawnerTtl = 0.25;
                    this.step++;
                    break;
                case 1:
                    this.AllInCircleSpawnerTtl = 0.2;
                    this.step++;
                    break;
                case 2:
                    this.AllInCircleSpawnerTtl = 0.15;
                    this.step++;
                    break;
                case 3:
                    this.AllInCircleSpawnerTtl = 0.1;
                    this.step++;
                    break;
                case 4:
                    this.AllInCircleSpawnerTtl = 2;
                    this.step = 0;
                    break;
            }
        }
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.AllInCircleSpawnerGameObject = new AllInCircleSpawnerGameObject(new RedBulletGameObject(this.bigSaucer.partition, new Vec2(), 150), this.bigSaucer, 12, 0);
            this.AllInCircleSpawnerGameObject.spawn();
        }
    }
}
class BigSaucerGunWave extends BaseCommand {
    constructor(bigSaucer) {
        super();
        this.bigSaucer = bigSaucer;
        this.spawnNumber = 2;
        this.deltaAngle = 2 * Math.PI / this.spawnNumber;
        this.angle = 0;
        this.angleSpeed = 200;
        this.ttl = this.maxTtl = 0.075;
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/laser1.mp3"), 50);
    }

    update(dt) {
        // Gestion de la vague de red bullets
        this.ttl -= dt;
        this.angle += this.angleSpeed * dt;
        if (this.ttl < 0) {
            this.ttl = this.maxTtl;
            this.canExecute = true;
             this.sound.play();
        }
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            // On spawne tous les exemplaires demandés
            for (let index = 0; index < this.spawnNumber; index++) {
        
                // Duplication du prototype
                let newShip = new GreenBulletGameObject(this.bigSaucer);
                newShip.position.x = this.bigSaucer.position.x + this.bigSaucer.size.x / 2;
                newShip.position.y = this.bigSaucer.position.y + this.bigSaucer.size.y / 2;
                
                // On lui donne une direction qui s'éloigne du point d'apparition
                newShip.moveStrategy = new UniformMoveStrategy(newShip, new Vec2(Math.cos(this.angle + this.deltaAngle * index), Math.sin(this.angle + this.deltaAngle * index)));
                newShip.speed = 250;

                // On l'ajoute à la liste des gameObjects de la scene
                Services.get("SCENE").currentScene.addGameObject(newShip);
            }
        }
    }
}
class BigSaucerCollideBox extends CompositeCollideBox {
    constructor(position, size) {
        super(position, size);
        this.addCollideBox(new CircleCollideBox(this.position, this.size.y / 2, new Vec2((this.size.x - this.size.y) / 2, 0)));
        this.addCollideBox(new RectCollideBox(this.position, new Vec2(this.size.x, this.size.y / 3), new Vec2(0, this.size.y / 3)));
    }
}
class BigSaucerComingOutApex extends CompositeCurve {
    constructor(size) {
        super();
        this.size = size;
        let screen = Services.get("SCREEN");
        
        // Points caractéristiques de la courbe
        let pt1 = new Vec2(screen.width, 0);
        let pt2 = new Vec2();
        let pt3 = new Vec2(0, (screen.height - this.size.y) / 2);
        let pt4 = new Vec2((screen.width - this.size.x) / 2, (screen.height - this.size.y) / 2);
        let pt5 = new Vec2(screen.width - this.size.x, (screen.height - this.size.y) / 2);
        let pt6 = new Vec2(screen.width - this.size.x, screen.height - this.size.y);
        let pt7 = new Vec2((screen.width - this.size.x) / 2, screen.height - this.size.y);
        let pt8 = new Vec2(0, screen.height - this.size.y);
        let pt9 = new Vec2(screen.width - this.size.x, 0);
        let pt10 = new Vec2(-this.size.x, 0);

        // Trajectoire en huit
        this.addCurve(new BezierCurve(8, [ pt1, pt2, pt3, pt4 ]));
        this.addCurve(new BezierCurve(8, [ pt4, pt5, pt6, pt7 ]));
        this.addCurve(new BezierCurve(8, [ pt7, pt8, pt3, pt4 ]));
        this.addCurve(new BezierCurve(8, [ pt4, pt5, pt9, pt10 ]));        
    }

    getClone() {
        return new BigSaucerComingOutApex(this.size);
    }
}
class BigSaucerFinalApex extends CompositeCurve {
    constructor(size) {
        super();
        this.size = size;
        let screen = Services.get("SCREEN");
        
        // Points caractéristiques de la courbe
        let pt1 = new Vec2(screen.width, 0);
        let pt2 = new Vec2();
        let pt3 = new Vec2(0, (screen.height - this.size.y) / 2);
        let pt4 = new Vec2((screen.width - this.size.x) / 2, (screen.height - this.size.y) / 2);
        let pt5 = new Vec2(screen.width - this.size.x, (screen.height - this.size.y) / 2);
        let pt6 = new Vec2(screen.width - this.size.x, screen.height - this.size.y);
        let pt7 = new Vec2((screen.width - this.size.x) / 2, screen.height - this.size.y);
        let pt8 = new Vec2(0, screen.height - this.size.y);
        let pt9 = new Vec2(screen.width - this.size.x, 0);
        let pt10 = new Vec2((screen.width - this.size.x) / 2, 0);

        // Trajectoire d'approche
        this.addCurve(new BezierCurve(8, [ pt1, pt2, pt3, pt4 ]));

        // Trajectoire en huit
        let curve = new CompositeCurve(true);
        curve.addCurve(new BezierCurve(8, [ pt4, pt5, pt6, pt7 ]));
        curve.addCurve(new BezierCurve(8, [ pt7, pt8, pt3, pt4 ]));
        curve.addCurve(new BezierCurve(8, [ pt4, pt5, pt9, pt10 ]));  
        curve.addCurve(new BezierCurve(8, [ pt10, pt2, pt3, pt4 ]));          

        this.addCurve(curve);
    }

    getClone() {
        return new BigSaucerFinalApex(this.size);
    }
}

class BigSaucerGameObject extends EnemyShipGameObject {


    constructor(playerShip, cubePrototype = new CubeGameObject(playerShip)) {
        // Paramétrage du vaisseau ennemi
        super(Services.get("ASSET").get("Images/bigsaucer.png"), new Vec2(256, 96), 120000, 0, Services.get("ASSET").get("Images/bigsaucer2.png"))
        this.layer = 0.999;

        this.playerShip = playerShip;

        // Stratégie de déplacement
        this.moveStrategy = new BezierApexMoveStrategy(this, new BigSaucerComingOutApex(this.size));

        // Boite de collision spécifique
        this.collideBox = new BigSaucerCollideBox(this.position, this.size);

        // Armement
        let firstStateWeapon = new WeaponState("Bullet Wave", new AsapFireCommand(new BigSaucerBulletWave(this)), 1);
        let secondStateWeapon = new WeaponState("Bullet Wave", new AsapFireCommand(new BigSaucerGunWave(this)), 2);

        firstStateWeapon.nextWeaponState = secondStateWeapon;
        secondStateWeapon.previousWeaponState = firstStateWeapon;

        let weapon = new Weapon(this, firstStateWeapon);
        this.fireCommand = new WeaponFireCommand(this, weapon);
        this.fireCommandUp = false;

        // Animation
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20 / 1000, true));
        this.startAnimation("IDLE", 0);

        // Animation de mort
        this.dieCommand.addCommand(new PopCommand(this, new ParticlesMediumExplosionGameObject(this, [ new GiantRedExplosionGameObject(100), new MediumRedExplosionGameObject(90), new RedExplosionGameObject(80) ])));
        this.sound = new SoundPool(Services.get("ASSET").get("Sounds/Rifle_v1_variation_02_wav.wav"), 25);
        this.dieCommand.addCommand(new PlaySoundCommand(Services.get("ASSET").get("Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav").cloneNode()));

        // Il spawn des cubes
        this.TimeSequenceSpawnerGameObject = new TimeSequenceSpawnerGameObject(cubePrototype, 0, this, 3, 15);
        this.TimeSequenceSpawnerGameObject.status = "ACTIVE";

        // On ajoute le HUD
        let screen = Services.get("SCREEN");
        this.bossHud = new RedMiniaturePanelUIElementDecorator(new RedHUDPanelUIElement(this, new Vec2(screen.width - 598 - 10, 0), false), new UIElementDecorator(new BigSaucerMiniatureGameObject()));
        this.bossHud.show();

        // Flash rouge lorsqu'on passe en phase 2
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        context.fillStyle = "red";
        context.fillRect(0, 0, screen.width, screen.height);
        this.flashLayer = new FlashingLayer(canvas);
    }

    static getAnimatedSprite() {
        let sprite = new AnimatedSprite(Services.get("ASSET").get("Images/bigsaucer.png"), new Vec2(256, 96));
        sprite.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20 / 1000, true));
        sprite.startAnimation("IDLE", 0);
        return sprite;
    }

    damage(amount) {
        super.damage(amount);
        if (!this.fireCommandUp && this.life < this.maxLife * 0.3) {
            this.fireCommandUp = true;
            this.fireCommand.weapon.levelUp();
            this.flashLayer.show();
        }
        this.sound.play();
    }

    getName() {
        return "Big Saucer";
    }

    getClone() {
        return new BigSaucerGameObject(this.playerShip);
    }

    update(dt) {
        super.update(dt);

        // Gestion du spawn de cubes
        this.TimeSequenceSpawnerGameObject.update(dt);

        // Mise à jour du HUD
        this.bossHud.update(dt);
    }

    draw(context) {
        super.draw(context);

        // Affichage du HUD
        this.bossHud.draw(context);
    }
}
class BigSaucerMiniatureGameObject extends AnimatedSprite {
    constructor() {        
        let miniature = ImageHandler.zoomImage(Services.get("ASSET").get("Images/bigsaucer.png"), new Vec2(0.5));
        super(miniature, new Vec2(128, 48))

        // Animation
        this.addAnimation(new Animation("IDLE", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20 / 1000, true));
        this.startAnimation("IDLE", 0);
    }
}
class BaseScene {
    // Le scheduler est l'objet qui gère le déroulement du temps au sein de la scène
    constructor() {
        // métronome de la scène
        this.scheduler = null;

          // Partition spatiale recréée à chaque update
        this.quadTree = null;

        // Collection de gameObjects à traiter
        this.gameObjectsCollection = [];

        // Partition entre les gameObjects du joueur et ceux du jeu pour faciliter les collisions
        this.gameObjectsPartitions = [];
        this.gameObjectsPartitions["PLAYER_PARTITION"] = [];
        this.gameObjectsPartitions["GAME_PARTITION"] = [];
        this.gameObjectsPartitions["NEUTRAL_PARTITION"] = [];

        // Vaisseau du joueur
        this.playerShip = null;

        this.fadingLayer = null;

        this.music = null;

        this.camShake = null;
    }

    addPlayerShip(playerShip) {
        this.playerShip = playerShip;
        this.addGameObject(this.playerShip);
    }

    addSynchronizedGameObject(gameObjet) {
        this.scheduler.register(gameObjet);
        this.addGameObject(gameObjet);
    }

    addGameObject(gameObjet) {
        // On cherche la place du nouvel élément dans le tableau
        this.gameObjectsCollection.splice(this.searchNewItemIndex(this.gameObjectsCollection, 0, this.gameObjectsCollection.length, gameObjet.layer), 0, gameObjet);

        // Partition entre les gameObjects du joueur, du décor et ceux du jeu pour faciliter les collisions
        this.gameObjectsPartitions[gameObjet.partition].push(gameObjet);
    }

    // Chargement de la scène
    load(start) {
        // Initialisation de la scène
        this.gameObjectsCollection = [];

        // On ajoute de suite la couche permettant les transitions de début et fin
        // Par défaut ce sera un ecran noir
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        context.fillStyle = "black";
        context.fillRect(0, 0, screen.width, screen.height);
        this.fadingLayer = new FadingLayer(canvas, true);
        this.addGameObject(this.fadingLayer);
    }

    // Gestion des début et fin de la scène
    show(command) {
        this.fadingLayer.hide(command);
        this.music.loop = true;
        this.music.currentTime = 0;
        this.music.play();
    }

    hide(command) {
        this.fadingLayer.show(command);
        setTimeout(() => {
            this.music.pause();
        }, 900);
    }

    // Le tableau étant trié, on peut rechercher par dichotomie pour être plus performant
    searchNewItemIndex(array, indexMin, indexMax, value) {
        // Le placement du nouvel item est trouvé
        if (indexMin == indexMax) return indexMin;

        // On coupe l'intervale restant en 2
        let index = Math.floor((indexMin + indexMax) / 2);

        // On détermine dans quelle partie de tableau rechercher
        if (value >= array[index].layer) {

            // On recherche le position dans la partie droite du tableau
            return this.searchNewItemIndex(array, index + 1, indexMax, value);
        }
        else {

            // On recherche le position dans la partie gauche
            return this.searchNewItemIndex(array, indexMin, index, value);
        }
    }

    manageCollision() {
        // On remplit notre quadTree pour la partition spatiale des gameObjects
        // (Seuls les gameObjects intervenants dans les collisions sont retenus)
        let screen = Services.get("SCREEN");
        this.quadTree = new QuadTree(new Vec2(), new Vec2(screen.width, screen.height));
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == "ACTIVE" && gameObject.collideBox.type != "NONE") {
                this.quadTree.addItem(gameObject);
            }
        });

         this.gameObjectsCollection.forEach(gameObject => {
            gameObject.collideBox.setCollided(false);

            // On ne traite que les objets qui ont une collideBox et qui sont actifs
            if (gameObject.collideBox.type != "NONE" && gameObject.status == "ACTIVE") {

                // On cherche les candidats à la collision avec notre gameObject
                this.quadTree.getCandidates(gameObject.collideBox).forEach(targetGameObject => {

                    // Les éléments doivent être dans des partitions différentes, 
                    // être active et avoir une collideBox
                    // pour vérifier une collision
                    if ((targetGameObject.partition != gameObject.partition) && 
                        (targetGameObject.status == "ACTIVE") && 
                        (targetGameObject.collideBox.type != "NONE") &&
                        (gameObject.collideBox.collide(targetGameObject.collideBox))) {

                            // Si une collision est détectée, on exécute le comportement associé du gameObject
                            // matérialisé dans une commande
                            gameObject.collideCommand.execute(targetGameObject);      
                    }
                });
            }
        });        
    }

    update(dt) {
        // On avance dans la scene
        this.scheduler.update(dt);

        this.camShake.update(dt);

        // On synchronise les fondu de l'écran et de la musique
        this.music.volume = (1 - this.fadingLayer.getRatio()) * 0.25;

        // On ne traite que les gameObjects en activité
        // et on supprime les gameObjects qui sont obsolètes
        let gameObjectsToKillCollection = [];
        this.gameObjectsCollection.forEach(gameObject => {

            if (gameObject.status == "ACTIVE") {

                // Update du gameObject
                gameObject.update(this.scheduler.getDeltaTime());

                // Si il est devenu obsolète, on le marque comme étant à supprimer
                if (gameObject.status == "OUTDATED") {
                    gameObjectsToKillCollection.push(gameObject);
                }
            }
            else if (gameObject.status == "OUTDATED") {
                gameObjectsToKillCollection.push(gameObject);
            }
        });
        
        // On supprime tous les gameObjects obsolètes
        gameObjectsToKillCollection.forEach(gameObject => {
            let index = this.gameObjectsCollection.indexOf(gameObject);
            if (index >= 0) {
                this.gameObjectsCollection.splice(index, 1);

                // On le supprime aussi de sa partition
                index = this.gameObjectsPartitions[gameObject.partition].indexOf(gameObject);
                if (index >= 0) {
                    this.gameObjectsPartitions[gameObject.partition].splice(index, 1);
                }    
            }            
        });       

        this.manageCollision();
    }

    draw(context) {        
        let shake = this.camShake.getShake();
        context.save();
        context.translate(shake.x, shake.y);
        // On ne dessine que les gameObjects en activité
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == "ACTIVE") {
                gameObject.draw(context);
            }
        });
        context.restore();

        if (Services.get("PARAMETER").colliderDisplay) {
            context.fillStyle = "White";
            context.font = "normal 10pt neuropol";
            context.fillText("Step         : " + Math.floor(this.scheduler.currentStep), 5, 755);
            context.fillText("Game objects : " + this.gameObjectsCollection.length, 5, 775);
            context.fillText("Fps          : " + Math.round(fpsList.reduce((a, b) => a + b) / fpsList.length), 5, 795);

            // Affichage du quadTree
            if (null != this.quadTree) {
                this.quadTree.draw(context);
            }
        }
    }
}
class SceneManager extends Manager {
    constructor() {
        super();
        this.scenes = [];
        this.currentScene = null;
        this.pause = false;
    }

    addScene(sceneName, scene) {
        this.scenes[sceneName] = scene;
    }

    setCurrent(sceneName, start) {
        this.currentScene = this.scenes[sceneName];
        this.currentScene.load(start);
    }

    update(dt) {
        if (this.currentScene != null) {
            let inputHandler = Services.get("INPUT");
            if (inputHandler.isPressed("Space")) {
                this.pause = !this.pause;
            }
            this.currentScene.update(dt);
        }
    }

    draw(context) {
        if (this.currentScene != null) {
            this.currentScene.draw(context);
        }
    }
}
class MainMenuRareoyArdeasImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Rareoy Ardeas", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Puisque tu le prends comme ça, c'est", "silver", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        text = new TextUIElement("moi qui viens!", "silver", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 260;
        text.draw(context);

        return canvas;
    }
}
class MainMenuBigSaucerImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 240;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Pauvre petite crotte terrestre!", "silver", "14pt neuropol");
        text.position.x = 70;
        text.position.y = 200;
        text.draw(context);

        text = new TextUIElement("Comment penses-tu défendre la terre", "silver", "14pt neuropol");
        text.position.x = 70;
        text.position.y = 260;
        text.draw(context);

        text = new TextUIElement("contre MOI et mes légions ???!!!", "silver", "14pt neuropol");
        text.position.x = 70;
        text.position.y = 280;
        text.draw(context);

        text = new TextUIElement("Je serai bientôt en route avec mes", "silver", "14pt neuropol");
        text.position.x = 70;
        text.position.y = 340;
        text.draw(context);

        text = new TextUIElement("fidèles Aliénoïdes pour te montrer,", "silver", "14pt neuropol");
        text.position.x = 70;
        text.position.y = 360;
        text.draw(context);

        text = new TextUIElement("répugnant terrien, notre manière de", "silver", "14pt neuropol");
        text.position.x = 70;
        text.position.y = 380;
        text.draw(context);

        text = new TextUIElement("traiter les avortons de ton espèce!", "silver", "14pt neuropol");
        text.position.x = 70;
        text.position.y = 400;
        text.draw(context);
        
        text = new TextUIElement("AH AH AH AH", "silver", "bold 18pt neuropol");
        text.position.x = 70;
        text.position.y = 460;
        text.draw(context);

        return canvas;
    }
}
class MainMenuPanelImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");
        let color = "silver";

        let style = "bold 26pt neuropol";
        let label = "Raphael DUCHOSSOY (Gamecodeur.fr)";
        context.font = style;
        let width = context.measureText(label).width;
        let text = new TextUIElement(label, color, style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.25;
        text.draw(context);

        style = "bold 148pt neuropol";
        label = "SPACE";
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.3;
        text.draw(context);

        style = "bold 84pt neuropol";
        label = "Battle Ships";
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.5;
        text.draw(context);

        style = "9.5pt neuropol";
        label = "Pour la survie de la terre face aux envahisseurs Alienoïdes, qui veulent la conquérir depuis des années ...";
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, color, style);
        text.position.x = (screen.width - width) / 2;        
        text.position.y = screen.height * 0.65;
        text.draw(context);

        return canvas;
    }
}
class MenuScene extends BaseScene {
    constructor() {
        super();
    }

    load(start) {
        super.load();

        let resources = Services.get("ASSET");
        let screen = Services.get("SCREEN");

        // Scene de jeu proprement dite
        let baseSpeed = 60;

        // Métronome de la scène
        this.scheduler = new LinearScheduler(baseSpeed);

        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        this.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        this.addGameObject(new RollingLayer(0.1, baseSpeed, resources.get("Images/gas2.png"), new Vec2(-1, 0)));

        // Le joueur est remplacé par une bille orange
        let playerShip = new CircleShape("orangered", new Vec2(6));
        playerShip.collideBox = new CircleCollideBox(playerShip.position, 3);
        playerShip.moveStrategy = new MouseControlledMoveStrategy(playerShip);
        playerShip.partition = "PLAYER_PARTITION";
        this.addPlayerShip(playerShip);

        this.camShake = new CamShake(playerShip);

        // Big Saucer met l'ambiance dans la scène
        let bigSaucer = new BigSaucerGameObject(playerShip, new TimedCubeGameObject(playerShip));
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        bigSaucer.bossHud = new UIElement();
        this.addGameObject(bigSaucer);

        // Panneau principal
        let mainPanel = new BigPanelUIElement(new Vec2(), false);
        mainPanel.addElement(new SpriteUIElement(MainMenuPanelImage.createInstance()));
        this.addGameObject(mainPanel);

        // Dialogue de Big Saucer
        let panel1 = new RedSmallPanelUIElement(new Vec2(screen.width - 619, 0), false);
        panel1.addElement(new SpriteUIElement(MainMenuBigSaucerImage.createInstance()));
        panel1 = new RedMiniaturePanelUIElementDecorator(panel1, new UIElementDecorator(new BigSaucerMiniatureGameObject()));
        panel1 = new DelayablePanelUIElementDecorator(panel1, 1);
        this.addGameObject(panel1);

        // Dialogue de Rareoy Ardeas
        let panel2 = new SmallPanelUIElement(new Vec2(0, screen.height - 619), false);
        panel2.addElement(new SpriteUIElement(MainMenuRareoyArdeasImage.createInstance()));
        panel2 = new MiniaturePanelUIElementDecorator(panel2, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        panel2 = new DelayablePanelUIElementDecorator(panel2, 2.5);
        this.addGameObject(panel2);

        // Pour commencer à jouer
        let button = new ButtonUIElement("Jouer", new PlayCommand(mainPanel, panel1, panel2));
        button.position.x = (screen.width - 321) / 2;
        button.position.y = screen.height * 0.75;
        mainPanel.addElement(button);

        // Début réél du jeu
        button = new ButtonUIElement("Allons-y ...", new SwitchSceneCommand(this, "LEVEL1", 1280));
        button.position.x = (619 - 321) / 2
        button.position.y = 614 * 0.6;
        panel2.addElement(button);

        // Démarrage de la musique
        this.music = resources.get("Musics/bensound-highoctane.mp3");

        // On commence la scène avec l'affichage du panneau principal
        mainPanel.show();

        // On affiche la scène
        this.show();
    }
}
class PlayCommand extends BaseCommand {
    constructor(mainPanel, startablePanel1, startablePanel2) {
        super();
        this.panel = mainPanel;
        this.startablePanel1 = startablePanel1;
        this.startablePanel2 = startablePanel2;
    }

    execute() {
        if (this.canExecute) {
            this.canExecute = false;
            this.panel.hide();
            this.startablePanel1.show();
            this.startablePanel2.show();
        }
    }
}
class Level1BigSaucer1Image {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Et c'est en venant jusqu'ici que tu", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 200;
        text.draw(context);
        
        text = new TextUIElement("penses me faire peur? ... AH AH", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        return canvas;
    }
}
class Level1BigSaucer2Image {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Immonde vermiceau!", "white", "bold 18pt neuropol");
        text.position.x = 100;
        text.position.y = 215;
        text.draw(context);
        
        return canvas;
    }
}
class Level1BigSaucer3Image {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("AH AH AH AH AH AH ......", "white", "bold 18pt neuropol");
        text.position.x = 100;
        text.position.y = 215;
        text.draw(context);
        
        return canvas;
    }
}
class Level1BigSaucer4Image {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Big Saucer", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Arrrrrrg!!", "white", "bold 18pt neuropol");
        text.position.x = 100;
        text.position.y = 200;
        text.draw(context);
        
        text = new TextUIElement("Faut-il donc tout faire soi-même?", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        return canvas;
    }
}
class Level1RareoyArdeas1Image {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let text = new TextUIElement("Rareoy Ardeas", "white", "bold 18pt neuropol");
        text.position.x = 200;
        text.position.y = 100;
        text.draw(context);

        text = new TextUIElement("Alors comment ça marche ... ?", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 230;
        text.draw(context);

        text = new TextUIElement("On dirait que les flèches permettent", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 310;
        text.draw(context);

        text = new TextUIElement("de diriger le vaisseau ...", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 340;
        text.draw(context);
        
        text = new TextUIElement("Et \"W\" active le tir!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 400;
        text.draw(context);

        text = new TextUIElement("Voilà, j'ai tout ce qu'il faut!", "white", "14pt neuropol");
        text.position.x = 100;
        text.position.y = 480;
        text.draw(context);

        return canvas;
    }
}
class Level1DefeatedImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let label = "Big Saucer"
        let style = "bold 42pt neuropol"
        context.font = style;
        let width = context.measureText(label).width;
        let text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.35;
        text.draw(context);

        label = "AH AH AH AH AH !!!"
        style = "bold 26pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.65;
        text.draw(context);

        label = "Et c'est sur \"ça\" que reposait la"
        style = "22pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.5;
        text.draw(context);
        
        label = "défense de la Terre ?"
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.55;
        text.draw(context);

        return canvas;
    }
}
class Level1VictoryImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        let label = "Klaw"
        let style = "bold 42pt neuropol"
        context.font = style;
        let width = context.measureText(label).width;
        let text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.4;
        text.draw(context);

        label = "Big Saucer n'était qu'un moins que rien!"
        style = "bold 26pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.5;
        text.draw(context);

        label = "Il t'a cependant bien sous-estimé."
        style = "22pt neuropol"
        context.font = style;
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.6;
        text.draw(context);
        
        label = "Ce qui ne sera plus mon cas maintenant!!"
        width = context.measureText(label).width;
        text = new TextUIElement(label, "white", style);
        text.position.x = (screen.width - width) / 2;
        text.position.y = screen.height * 0.65;
        text.draw(context);

        return canvas;
    }
}
class Level1TitleImage {
    static createInstance() {
        let screen = Services.get("SCREEN");
        let canvas = ImageHandler.createCanvas(screen.width, screen.height);
        let context = canvas.getContext("2d");

        context.font = "bold 92pt neuropol";
        let width = context.measureText("GUDAÎTURN").width;
        let text = new TextUIElement("GUDAÎTURN", "white", "bold 92pt neuropol");
        text.position.x = (screen.width - width) / 2;
        text.position.y = 300;
        text.draw(context);
        
        let line = text.position;
        let lineWidth = width;

        context.font = "20pt neuropol";
        width = context.measureText("Bastion de Big Saucer").width;
        text = new TextUIElement("Bastion de Big Saucer", "white", "20pt neuropol");
        text.position.x = (screen.width - width) / 2;
        text.position.y = 450;
        text.draw(context);

        context.beginPath();
        context.strokeStyle = "white";
        context.moveTo(line.x, line.y + 130);
        context.lineTo(line.x + lineWidth, line.y + 130);
        context.stroke();

        return canvas;
    }
}
class Level1Scene extends BaseScene {
    constructor() {
        super()
    }

    load(start) {
        super.load(start);

        let resources = Services.get("ASSET");
        let screen = Services.get("SCREEN");

        // Scene de jeu proprement dite
        let baseSpeed = 120;

        // Métronome
        this.scheduler = new LinearScheduler(baseSpeed, start == null || start == 0 ? screen.width : start);

        // Gestion du joueur
        let playerShip = new Player1ShipGameObject(new Vec2((screen.width - 64) / 4, (screen.height - 64) / 2));
        playerShip.moveStrategy = new PlayerEntranceMoveStrategy(playerShip);
        this.addPlayerShip(playerShip);
        this.addGameObject(playerShip.flashLayer);
        this.camShake = new CamShake(playerShip);

        // On ajoute le HUD
        let hud = new HUDPanelUIElement(playerShip, new Vec2(), false);
        playerShip.hud = hud;
        hud = new MiniaturePanelUIElementDecorator(hud, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        hud = new StartableUIElementDecorator(hud, 2400);
        this.addSynchronizedGameObject(hud); 

        // Ecran de défaite
        let defeatPanel = new RedBigPanelUIElement(new Vec2(), false);
        defeatPanel.addElement(new SpriteUIElement(Level1DefeatedImage.createInstance()));
        let button = new ButtonUIElement("Rejouer", new SwitchSceneCommand(this, "LEVEL1", 2101));
        button.position.x = (screen.width - 2 * 321) / 3;
        button.position.y = screen.height * 0.75;
        defeatPanel.addElement(button);
        button = new ButtonUIElement("Menu", new SwitchSceneCommand(this, "MENU"));
        button.position.x = 2 * (screen.width - 2 * 321) / 3 + 321;
        button.position.y = screen.height * 0.75;
        defeatPanel.addElement(button);
        defeatPanel.addElement(new SpriteUIElement(Level1DefeatedImage.createInstance()));
        let bigSaucerSprite = new UIElementDecorator(BigSaucerGameObject.getAnimatedSprite());
        bigSaucerSprite.position.x = (screen.width - bigSaucerSprite.size.x) / 2;
        bigSaucerSprite.position.y = screen.height * 0.15;
        defeatPanel.addElement(bigSaucerSprite);
        defeatPanel = new DelayablePanelUIElementDecorator(defeatPanel, 0.5);
        this.addGameObject(defeatPanel);

        // En cas de mort du joueur
        playerShip.dieCommand.addCommand(new HidePlayerCommand(playerShip));
        playerShip.dieCommand.addCommand(new HidePanelCommand(hud));
        playerShip.dieCommand.addCommand(new ShowPanelCommand(defeatPanel));
        playerShip.dieCommand.addCommand(new PurgePartitionCommand(this.gameObjectsPartitions["GAME_PARTITION"]));
        playerShip.dieCommand.addCommand(new StopSchedulerCommand(playerShip, this.scheduler));
        playerShip.dieCommand.addCommand(new SwitchMusicCommand(this, resources.get("Musics/alexander-nakarada-loss.mp3")));

        // assetLoader.add(AssetLoader.SOUND, "Musics/alexander-nakarada-loss.mp3");
        // assetLoader.add(AssetLoader.SOUND, "Musics/alexander-nakarada-we-are-victorious-finale.mp3");

        // On enregistre les controles à utiliser
        let inputListener = Services.get("INPUT");
        inputListener.clearCommands();
        inputListener.registerCommand("ArrowUp", new MoveCommand(this.playerShip, new Vec2(0, -1)));
        inputListener.registerCommand("ArrowDown", new MoveCommand(this.playerShip, new Vec2(0, 1)));
        inputListener.registerCommand("ArrowLeft", new MoveCommand(this.playerShip, new Vec2(-1, 0)));
        inputListener.registerCommand("ArrowRight", new MoveCommand(this.playerShip, new Vec2(1, 0)));
        inputListener.registerCommand("Escape", new SwitchSceneCommand(this, "MENU"));
        inputListener.registerCommand("KeyZ", new FireActionCommand(this.playerShip));


        // Gestion des backgrounds
        // Le fond est représenté par un rectangle noir qui fait la taille du canvas et il est constant
        this.addGameObject(new BlackStaticBackgroundGameObject());

        // La background principal
        this.addGameObject(new RollingLayer(0.2, baseSpeed, resources.get("Images/background1.png"), new Vec2(-1, 0)));

        // Eléments de décor qui ne vont passer qu'une fois
        this.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.get("Images/station.png"), 2000, new Vec2(-1, 0)));
        this.addSynchronizedGameObject(new OnceLayer(0.3, baseSpeed, resources.get("Images/background2.png"), 8000, new Vec2(-1, 0)));
        this.addSynchronizedGameObject(new OnceLayer(0.5, baseSpeed, resources.get("Images/background3.png"), 10000, new Vec2(-1, 0)));

        // Ajout d'obstacles        
        let rockyDecorImage = new RockyDecorImage();
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, screen.width, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));
        this.addSynchronizedGameObject(new DecorsGameObject(rockyDecorImage.image, 0.9, baseSpeed, 11000, new Vec2(screen.width, screen.height - rockyDecorImage.image.height), false));

        // On retourne le décor rocheux pour l'utiliser dans la scène
        this.addSynchronizedGameObject(new DecorsGameObject(ImageHandler.flipImage(rockyDecorImage.image, new Vec2(-1)), 0.9, baseSpeed, 6150, new Vec2(screen.width, 0), false));

        // Obstacle de 1er plan
        // this.addSynchronizedGameObject(new DecorsGameObject(Soil1DecorImage.createInstance(), 2, baseSpeed, 5000, new Vec2(screen.width, screen.height - Soil1DecorImage.getInstance().height), true));

        // Déroulement de la scène

        // Narration : Titre du niveau
        let panel = new PanelUIElement(new Vec2(), true);
        panel.addElement(new SpriteUIElement(Level1TitleImage.createInstance()));
        let startableElement = new DelayablePanelUIElementDecorator(panel, 1, 3);
        startableElement.show();
        this.addGameObject(startableElement); 

        // Narration : Commandes de jeu
        panel = new SmallPanelUIElement(new Vec2(0, screen.height - 614), false);
        panel.addElement(new SpriteUIElement(Level1RareoyArdeas1Image.createInstance()));
        panel = new MiniaturePanelUIElementDecorator(panel, new UIElementDecorator(new Player1ShipMiniatureGameObject()));
        panel = new StartableUIElementDecorator(panel, 1780, 2100);
        this.addSynchronizedGameObject(panel); 

        // Narration : Big Saucer
        let bigSaucerMiniature = new UIElementDecorator(new BigSaucerMiniatureGameObject(), true);
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - 619, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer1Image.createInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 2120, 2360);
        this.addSynchronizedGameObject(panel); 

        // Gestion des vagues
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 2800, new Vec2(screen.width, screen.height / 2), 0.4, 6));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 3100, new Vec2(screen.width, screen.height / 2),  0.45, 7));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 3300, new Vec2(screen.width, screen.height / 2),  0.5, 8));

        // // Gestion des bonus
        this.addSynchronizedGameObject(new OnceSpawnerGameObject(new SpeedPowerUpGameObject(this.playerShip), 3400, new Vec2(screen.width, (screen.height - 200) / 2)));

        // Vagues suivantes
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new WobblerGameObject(playerShip), 4000, new Vec2(-64), 0.4, 10));

        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 4900, new Vec2(screen.width, screen.height / 2), 0.4, 8));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 5200, new Vec2(screen.width, screen.height / 2),  0.35, 10));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 5400, new Vec2(screen.width, screen.height / 2),  0.3, 12));

        // Narration : Big Saucer
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - 619, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer2Image.createInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 6100, 6500);
        this.addSynchronizedGameObject(panel); 
        
        // Passage de Big Saucer
        let bigSaucer = new BigSaucerGameObject(playerShip);
        this.addSynchronizedGameObject(new OnceSpawnerGameObject(bigSaucer, 6600, new Vec2(), resources.get("Sounds/Tense_01_wav.wav")));
        this.addGameObject(bigSaucer.flashLayer);

        // Narration : Big Saucer
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - 619, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer3Image.createInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 10000, 10400);
        this.addSynchronizedGameObject(panel); 

        // Gestion des vagues
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 10500, new Vec2(screen.width, screen.height / 2), 0.3, 10));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 10700, new Vec2(screen.width, screen.height / 2),  0.4, 12));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 11000, new Vec2(screen.width, screen.height / 2),  0.3, 14));

        // // Gestion des bonus
        this.addSynchronizedGameObject(new OnceSpawnerGameObject(new SpeedPowerUpGameObject(this.playerShip), 11500, new Vec2(screen.width, (screen.height - 200) / 2)));

        let mainCurve = new CompositeCurve();
        let curve = new CompositeCurve(true, 2);
        curve.addCurve(new BezierCurve(5, [ new Vec2(640, 400), new Vec2(640, 736), new Vec2(304, 736), new Vec2(304, 400) ]));
        curve.addCurve(new BezierCurve(5, [ new Vec2(304, 400), new Vec2(304, 64), new Vec2(640, 64), new Vec2(640, 400) ]));
        mainCurve.addCurve(curve);
        mainCurve.addCurve(new BezierCurve(5, [ new Vec2(640, 400), new Vec2(640, 736), new Vec2(-128, 736) ]));
        let ship = new AtomGameObject();
        let moveStrategy = new BezierApexMoveStrategy(ship, mainCurve);
        ship.moveStrategy = moveStrategy;
        this.addSynchronizedGameObject(new AllInCircleSpawnerGameObject(ship, new Vec2(2 * (screen.width - ship.size.x) / 3, (screen.height - ship.size.y) / 2), 12, 12000));

        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 15500, new Vec2(screen.width, screen.height / 2), 0.25, 14));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 15650, new Vec2(screen.width, screen.height / 2),  0.5, 16));
        this.addSynchronizedGameObject(new TimeSequenceSpawnerGameObject(new StarknifeGameObject(Math.random() * 2 * Math.PI), 15800, new Vec2(screen.width, screen.height / 2), 0.25, 18));
       
        // Narration
        panel = new RedVerySmallPanelUIElement(new Vec2(screen.width - 619, 0), false);
        panel.addElement(new SpriteUIElement(Level1BigSaucer4Image.createInstance()));
        panel = new RedMiniaturePanelUIElementDecorator(panel, bigSaucerMiniature);
        panel = new StartableUIElementDecorator(panel, 17000, 17600);
        this.addSynchronizedGameObject(panel); 

        // // Boss
        // Ecran de victoire
        let victoryPanel = new BlueBigPanelUIElement(new Vec2(), false);
        victoryPanel.addElement(new SpriteUIElement(Level1VictoryImage.createInstance()));
        button = new ButtonUIElement("Menu", new SwitchSceneCommand(this, "MENU"));
        button.position.x = (screen.width - 2 * 321) / 3;
        button.position.y = screen.height * 0.75;
        victoryPanel.addElement(button);
        button = new ButtonUIElement("Continuer", new SwitchSceneCommand(this, "MENU"));
        button.position.x = 2 * (screen.width - 2 * 321) / 3 + 321;
        button.position.y = screen.height * 0.75;
        victoryPanel.addElement(button);
        let klawSprite = new UIElementDecorator(KlawGameObject.getAnimatedSprite());
        klawSprite.position.x = (screen.width - klawSprite.size.x) / 2;
        klawSprite.position.y = screen.height * 0.1;
        victoryPanel.addElement(klawSprite);
        victoryPanel = new DelayablePanelUIElementDecorator(victoryPanel, 0.5);
        this.addGameObject(victoryPanel);

        bigSaucer = new BigSaucerGameObject(playerShip);
        bigSaucer.moveStrategy = new BezierApexMoveStrategy(bigSaucer, new BigSaucerFinalApex(bigSaucer.size)); 
        bigSaucer.dieCommand.addCommand(new HidePanelCommand(hud));
        bigSaucer.dieCommand.addCommand(new HidePanelCommand(bigSaucer.bossHud));
        bigSaucer.dieCommand.addCommand(new ShowPanelCommand(victoryPanel));
        bigSaucer.dieCommand.addCommand(new PurgePartitionCommand(this.gameObjectsPartitions["GAME_PARTITION"]));
        bigSaucer.dieCommand.addCommand(new StopSchedulerCommand(playerShip, this.scheduler));
        bigSaucer.dieCommand.addCommand(new SwitchMusicCommand(this, resources.get("Musics/alexander-nakarada-we-are-victorious-finale.mp3")));

        this.addSynchronizedGameObject(new OnceSpawnerGameObject(bigSaucer, 17700, new Vec2(), resources.get("Sounds/Tense_01_wav.wav")));
        this.addGameObject(bigSaucer.flashLayer);
 
        // // Démarrage de la musique
        this.music = resources.get("Musics/bensound-scifi.mp3");

        this.show();
    }
}
class UIElement extends GameObject {
    constructor(visibility = false) {
        super();
        this.visibility = visibility;
        this.globalAlpha = this.visibility ? 1 : 0;
        this.partition = "NEUTRAL_PARTITION";
    }

    setPosition(position) {
        this.position = position;
    }

    setAlpha(alpha) {
        this.globalAlpha = alpha;
    }

    getAlpha() {
        return this.globalAlpha;
    }
}
class UIElementDecorator extends UIElement {
    constructor(gameObject) {
        super();
        this.gameObject = gameObject;
        this.size = this.gameObject.size;
    }

    setPosition(position) {
        this.position = position;
        this.gameObject.position.x = position.x;
        this.gameObject.position.y = position.y;
    }

    setAlpha(alpha) {
        this.gameObject.globalAlpha = alpha;
    }

    getAlpha() {
        return this.gameObject.globalAlpha;
    }   

    update(dt) {
        this.gameObject.update(dt);
    }

    draw(context) {
        this.gameObject.draw(context);
    }
}
class TextUIElement extends UIElement{
    constructor(label, color, format) {
        super(true);
        this.label = label;
        this.color = color;
        this.format = format;
        this.size.x = ImageHandler.textLength(this.label, this.format);
    }
    
    draw(context) {
        if (this.visibility) {
            context.save();
            context.globalAlpha = this.getAlpha();;
            context.textBaseline = "top";
            context.fillStyle = this.color;
            context.font = this.format;
            context.fillText(this.label, this.position.x, this.position.y);
            context.restore();
        }
    } 
}
class SpriteUIElement extends UIElement {
    constructor(image) {
        super();
        this.sprite = new Sprite(image);
    }

    setPosition(position) {
        this.sprite.position = position;
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.sprite.globalAlpha = alpha;
    }

    update(dt) {
        this.sprite.update(dt);
    }

    draw(context) {
        this.sprite.draw(context);
    }
}
class PanelUIElement  extends UIElement {
    constructor(position, size, visibility, soundWhenShowned = null) {
        super(visibility);
        this.position = position;
        this.size = size;
        this.internalUIElement = [];
        this.pendingVisibility = false;
        this.alphaDirection = 0;
        this.visibilityMaxTtl = 0.25;
        this.soundWhenShowned = soundWhenShowned;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    addElement(element) {
        element.visibility = this.visibility;
        element.setAlpha(this.getAlpha());        
        element.setPosition(new Vec2(element.position.x + this.position.x, element.position.y + this.position.y));
        this.internalUIElement.push(element);
    }

    setVisibility(visibility) {
        this.visibility = visibility;
        this.internalUIElement.forEach(element => {
            element.visibility = this.visibility;
        });        
    }

    setAlpha(alpha) {
        super.setAlpha(alpha);
        this.globalAlpha = alpha;
        this.internalUIElement.forEach(element => {
            element.setAlpha(alpha);
        });
    }

    getAlpha() {
        return this.globalAlpha;
    }

    hide() {
        this.setAlpha(1);
        this.pendingVisibility = true;
        this.alphaDirection = -1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    show() {
        this.setAlpha(0);
        this.setVisibility(true);
        this.pendingVisibility = true;
        this.alphaDirection = 1;
        this.visibilityTtl = this.visibilityMaxTtl;
    }

    update(dt) {
        super.update(dt);
        if (this.pendingVisibility) {
            this.visibilityTtl -= dt;
            if (this.visibilityTtl <= 0) {
                this.pendingVisibility = false;
                this.setVisibility(this.alphaDirection < 0 ? false : this.alphaDirection);
                if (this.getAlpha() && this.soundWhenShowned != null) {
                    this.soundWhenShowned.play();
                }
            }
            else {
                this.setAlpha(this.alphaDirection > 0 ? (this.visibilityMaxTtl - this.visibilityTtl) / this.visibilityMaxTtl : this.visibilityTtl / this.visibilityMaxTtl);
            }
        }
        this.internalUIElement.forEach(element => {
            element.update(dt);
        });
    }

    draw(context) {
        if (this.visibility) {
            this.internalUIElement.forEach(element => {
                element.draw(context);
            });
        }
    }    
}
class BasePanelUIElementDecorator  extends PanelUIElement {
    constructor(panel) {
        super(panel.visibility);
        this.panel = panel;
    }

    addElement(element) {
        this.panel.addElement(element);
    }

    setVisibility(visibility) {
        this.panel.setVisibility(visibility);
    }

    setAlpha(alpha) {
        this.panel.setAlpha(alpha);
    }

    getAlpha() {
        this.panel.getAlpha();
    }

    hide() {
        this.panel.hide();
    }

    show() {
        this.panel.show();
    }

    update(dt) {
        this.panel.update(dt);
    }

    draw(context) {
        this.panel.draw(context);
    }    
}
class BaseBigPanelUIElement extends PanelUIElement {
    constructor(position, visibility, background) {
        super(position, new Vec2(1280, 800), visibility);
        this.addElement(new SpriteUIElement(background));
     }
}
class BigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/bigPanel.png"));
     }
}
class BlueBigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/bigPanel1.png"));
     }
}
class RedBigPanelUIElement extends BaseBigPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/bigPanel2.png"));
     }
}

class ButtonUIElement extends UIElement {
    constructor(label, command) {
        super();
        this.command = command;
        this.sprite = new Sprite(Services.get("ASSET").get("Images/Gui/button.png"));
        this.position = this.sprite.position;
        this.size = this.sprite.size;
        this.collideBox = new RectCollideBox(this.position, this.size);
        this.textUIElement = new TextUIElement(label, "black", "bold 24pt neuropol");
        this.hoverSound = new SoundPool(Services.get("ASSET").get("Sounds/Hover_Digital_06_wav.wav"), 10);
        this.clickSound = Services.get("ASSET").get("Sounds/Click_Digital_06_wav.wav");
        this.previouslyHover = this.hover = false;
    }

    setPosition(position) {
        super.setPosition(position);
        this.sprite.position = position;
        this.collideBox.position = this.position;
    }

    setAlpha(alpha) {
        this.sprite.globalAlpha = alpha;
        this.textUIElement.setAlpha(alpha);
    }

    getAlpha() {
        return this.sprite.globalAlpha;
    }

    update(dt) {
        super.update(dt);
        this.textUIElement.position.x = this.position.x + (this.size.x - this.textUIElement.size.x) / 2;
        this.textUIElement.position.y = this.position.y + this.size.y * 0.3;

        let inputHandler = Services.get("INPUT");
        this.previouslyHover = this.hover;
        this.hover = this.visibility && Collider.isPointInRectangle(inputHandler.mouse, this.collideBox);
        if (this.hover) {
            if (!this.previouslyHover) {
                this.hoverSound.play();
            }
            if (inputHandler.isClicked()) {
                this.command.execute();
            }
        }
    }

    draw(context) {
        super.draw(context);
        if (this.visibility) {
            this.sprite.draw(context);
            this.textUIElement.draw(context);
        }
    }    
}
class DelayablePanelUIElementDecorator extends BasePanelUIElementDecorator {
    constructor(panel, delay, duration = 0) {
        super(panel)
        this.started = false;
        this.showned = false;
        this.duration = duration;
        this.ttl = delay;
    }

    show() {
        this.started = true;
    }

    update(dt) {
        this.panel.update(dt);
        if (this.started) {
            this.ttl -= dt;
            if (this.ttl < 0) {
                super.show();
                this.started = false;
                this.showned = true;
                this.ttl = this.duration;
            }
        }
        if (this.showned && this.duration != 0) {
            this.ttl -= dt;
            if (this.ttl < 0) {
                super.hide();
                this.showned = false;
            }
        }
    }
}
class BaseMiniaturePanelUIElementDecorator extends BasePanelUIElementDecorator {
    constructor(panel, miniature, offset) {
        super(panel);
        this.offset = offset;
        this.miniature = miniature;
        this.miniature.position.x = this.offset.x - this.miniature.size.x / 2;
        this.miniature.position.y = this.offset.y - this.miniature.size.y / 2;
        this.addElement(this.miniature);
    }
}
class MiniaturePanelUIElementDecorator extends BaseMiniaturePanelUIElementDecorator {
    constructor(panel, miniature) {
        super(panel, miniature, new Vec2(92, 96));
    }
}
class RedMiniaturePanelUIElementDecorator extends BaseMiniaturePanelUIElementDecorator {
    constructor(panel, miniature) {
        super(panel, miniature, new Vec2(527, 96));
    }
}
class BasePanelUIElement extends PanelUIElement {
    constructor(position, visibility, background, sound) {
        super(position, new Vec2(619, 614), visibility, sound);
        this.addElement(new SpriteUIElement(background));
    }
}
class SmallPanelUIElement extends BasePanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/smallPanel.png"), Services.get("ASSET").get("Sounds/Digital_panel_v1_variation_01_wav.wav"));
    }
}
class RedSmallPanelUIElement extends BasePanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/smallPanel2.png"), Services.get("ASSET").get("Sounds/Digital_panel_v1_variation_02_wav.wav"));
    }
}
class StartableUIElementDecorator  extends BasePanelUIElementDecorator {
    constructor(panel, startingPoint, endPoint = 0) {
        super(panel);
        this.startingPoint = startingPoint;
        this.endPoint = endPoint;
        this.started = this.ended = false;
    }
    
    subjectChanged(scheduler) {
        if (this.endPoint != 0 && scheduler.currentStep >= this.endPoint && !this.started) {
            this.started = this.ended = true;
        }
        if (!this.started && scheduler.currentStep >= this.startingPoint) {
            this.started = true;
            this.show();
        }
        if (this.endPoint != 0 && this.started && !this.ended && scheduler.currentStep >= this.endPoint) {
            this.ended = true;
            this.hide();
        }

    }
}
class BaseVerySmallPanelUIElement extends PanelUIElement {
    constructor(position, visibility, background, sound) {
        super(position, new Vec2(619, 330), visibility, sound);
        this.addElement(new SpriteUIElement(background));
    }
}
class VerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/verySmallPanel.png"), Services.get("ASSET").get("Sounds/Digital_panel_v1_variation_01_wav.wav"));
    }
}
class RedVerySmallPanelUIElement extends BaseVerySmallPanelUIElement {
    constructor(position, visibility) {
        super(position, visibility, Services.get("ASSET").get("Images/Gui/verySmallPanel2.png"), Services.get("ASSET").get("Sounds/Digital_panel_v1_variation_02_wav.wav"));
    }
}
class BaseHUDPanelUIElement extends PanelUIElement {
    constructor(playerShip, position, visibility, backgroundVisual, lifeBar, lifeOffset, backgroundOffset, titleOffset, weaponOffset) {
        super(position, visibility);
        this.playerShip = playerShip;

        let background = new SpriteUIElement(backgroundVisual);
        background.position.x = backgroundOffset.x;
        background.position.y = backgroundOffset.y;
        this.addElement(background);

        this.lifeBar = lifeBar;
        this.lifeBarUIElement = new UIElementDecorator(this.lifeBar) 
        this.lifeBarUIElement.position.x = lifeOffset.x;
        this.lifeBarUIElement.position.y = lifeOffset.y;
        this.addElement(this.lifeBarUIElement);

        let text = new TextUIElement(playerShip.getName(), "white", "12pt neuropol");
        text.position.x = titleOffset.x;
        text.position.y = titleOffset.y;
        this.addElement(text);

        this.weaponText = null;
        if (this.playerShip.fireCommand.weapon != null) {
            this.weaponText = new TextUIElement(this.playerShip.fireCommand.weapon.getName(), "silver", "12pt neuropol");
            this.weaponText.position.x = weaponOffset.x;
            this.weaponText.position.y = weaponOffset.y;
            this.addElement(this.weaponText);
        }
    }

    update(dt) {
        super.update(dt);
        this.lifeBar.setRatio(this.playerShip.life / this.playerShip.maxLife);
        if (null != this.weaponText) {
            this.weaponText.label = this.playerShip.fireCommand.weapon.getName();
        }
    }
}
class HUDPanelUIElement extends BaseHUDPanelUIElement {
    constructor(playerShip, position, visibility) {
        super(playerShip, position, visibility, 
            Services.get("ASSET").get("Images/Gui/playerHud.png"), new LifeBarGameObject(), 
            new Vec2(140, 50), new Vec2(-10, 10), new Vec2(200, 30), new Vec2(200, 150));
            this.speedBonus = 0;
            this.weaponBonus = 0;
            this.addWeaponBonus()
        }

    update(dt) {
        super.update(dt);
    }

    addSpeedBonus() {
        let miniature = new UIElementDecorator(new MiniSpeedUpGameObject());
        miniature.position = this.getNextSpeedBonusPosition();
        this.addElement(miniature);
        this.speedBonus++;
    }

    getNextSpeedBonusPosition() {
        return new Vec2(375 + (this.speedBonus + 1) * 30, 24)
    }

    addWeaponBonus() {
        if (this.weaponBonus < 5) {
            this.weaponBonus++;
            let miniature = new UIElementDecorator(new MiniWeaponUpGameObject());
            miniature.position = this.getNextWeaponBonusPosition();
            this.addElement(miniature);
        }
    }

    getNextWeaponBonusPosition() {
        return new Vec2(275 + (this.weaponBonus + 1) * 30, 144)
    }
}
class RedHUDPanelUIElement extends BaseHUDPanelUIElement {
    constructor(playerShip, position, visibility) {
        super(playerShip, position, visibility, Services.get("ASSET").get("Images/Gui/playerHud2.png"), new RedLifeBarGameObject(),
        new Vec2(Services.get("SCREEN").width - 598 - 210 - 472, 50), new Vec2(30, 10), new Vec2(200, 30), new Vec2(200, 150));
    }
}

let gameReady = false;
let sceneManager = null;

// Gestion des images de chargement
let loaderImage = document.getElementById("loaderImage");
let loaderText = document.getElementById("loaderText");
let loaderImages = [];
let totalDt = 0;

const Services = new ServicesLocator();

for (let index = 1; index <= 14; index++) {
    let item = document.getElementById("loaderImage-" + index); 
    loaderImages.push(item.src);
}

function keyDownEventListener(key) {
    key.preventDefault();
    Services.get("INPUT").switchOn(key.code);
}

function keyUpEventListener(key) {
    key.preventDefault();
    Services.get("INPUT").switchOff(key.code);
}

function mouseMoveEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get("INPUT").mouseMove(event.clientX, event.clientY);
}

function mouseDownEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get("INPUT").mouseDown();
}

function mouseUpEventListener(event) {
    event.preventDefault();
    // event.stopPropagation();
    Services.get("INPUT").mouseUp();
}

function load(canvas) {
    let inputListener = new InputListener();

    // Pour le calcul des coordonnées de la souris
    inputListener.offSet = new Vec2(canvas.left, canvas.top);

    // Gestion du clavier
    document.addEventListener("keydown", keyDownEventListener, false);
    document.addEventListener("keyup", keyUpEventListener, false);

    // Gestion de la souris
    canvas.addEventListener('mousemove', mouseMoveEventListener, false);
    canvas.addEventListener('mousedown', mouseDownEventListener, false);
    canvas.addEventListener('mouseup', mouseUpEventListener, false);

    // Gestion de ressources
    let assetLoader = new AssetLoader();

    // Services utilisés dans toute l'application
    Services.register("SCREEN", { width : canvas.width, height : canvas.height });
    Services.register("INPUT", inputListener);
    Services.register("ASSET", assetLoader);
    Services.register("PARAMETER", new Parameter());
    
    // Ressources à charger
    assetLoader.add("IMAGE", "Images/player1.png");
    assetLoader.add("IMAGE", "Images/player2.png");
    assetLoader.add("IMAGE", "Images/starknife.png");
    assetLoader.add("IMAGE", "Images/starknife2.png");
    assetLoader.add("IMAGE", "Images/wobbler.png");
    assetLoader.add("IMAGE", "Images/wobbler2.png");
    assetLoader.add("IMAGE", "Images/station.png");
    assetLoader.add("IMAGE", "Images/background1.png");
    assetLoader.add("IMAGE", "Images/background2.png");
    assetLoader.add("IMAGE", "Images/background3.png");
    assetLoader.add("IMAGE", "Images/rock7.png");
    assetLoader.add("IMAGE", "Images/rock8.png");
    assetLoader.add("IMAGE", "Images/rock9.png");
    assetLoader.add("IMAGE", "Images/rock10.png");
    assetLoader.add("IMAGE", "Images/rock11.png");
    assetLoader.add("IMAGE", "Images/speedpowerup.png");
    assetLoader.add("IMAGE", "Images/powerup.png");
    assetLoader.add("IMAGE", "Images/bluespark.png");
    assetLoader.add("IMAGE", "Images/redspark.png");
    assetLoader.add("IMAGE", "Images/greenspark.png");
    assetLoader.add("IMAGE", "Images/purplespark.png");
    assetLoader.add("IMAGE", "Images/laser.png");
    assetLoader.add("IMAGE", "Images/redbullet.png");
    assetLoader.add("IMAGE", "Images/bluebullet.png");
    assetLoader.add("IMAGE", "Images/greenbullet.png");
    assetLoader.add("IMAGE", "Images/rocket.png");
    assetLoader.add("IMAGE", "Images/soil1.png");
    assetLoader.add("IMAGE", "Images/soil2.png");
    assetLoader.add("IMAGE", "Images/soil3.png");
    assetLoader.add("IMAGE", "Images/soil4.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_end_left.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_end_right.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_tile.png");
    assetLoader.add("IMAGE", "Images/tech_bottom_tile2.png");
    assetLoader.add("IMAGE", "Images/bigsaucer.png");
    assetLoader.add("IMAGE", "Images/cube.png");
    assetLoader.add("IMAGE", "Images/bigsaucer2.png");
    assetLoader.add("IMAGE", "Images/cube2.png");
    assetLoader.add("IMAGE", "Images/gas2.png");
    assetLoader.add("IMAGE", "Images/klaw.png");
    assetLoader.add("IMAGE", "Images/atom.png");
    assetLoader.add("IMAGE", "Images/atom2.png");
    assetLoader.add("IMAGE", "Images/Gui/bigPanel.png");
    assetLoader.add("IMAGE", "Images/Gui/bigPanel1.png");
    assetLoader.add("IMAGE", "Images/Gui/bigPanel2.png");
    assetLoader.add("IMAGE", "Images/Gui/button.png");
    assetLoader.add("IMAGE", "Images/Gui/smallPanel.png");
    assetLoader.add("IMAGE", "Images/Gui/verySmallPanel.png");
    assetLoader.add("IMAGE", "Images/Gui/lifeBar.png");
    assetLoader.add("IMAGE", "Images/Gui/playerHud.png");
    assetLoader.add("IMAGE", "Images/Gui/smallPanel2.png");
    assetLoader.add("IMAGE", "Images/Gui/verySmallPanel2.png");
    assetLoader.add("IMAGE", "Images/Gui/lifeBar2.png");
    assetLoader.add("IMAGE", "Images/Gui/playerHud2.png");
    assetLoader.add("IMAGE", "Images/shield.png");
    assetLoader.add("IMAGE", "Images/life.png");

    assetLoader.add("SOUND", "Sounds/laser1.mp3");
    assetLoader.add("SOUND", "Sounds/laser2.mp3");
    assetLoader.add("SOUND", "Sounds/laser3.mp3");
    assetLoader.add("SOUND", "Sounds/laser4.mp3");
    assetLoader.add("SOUND", "Sounds/laser5.mp3");
    assetLoader.add("SOUND", "Sounds/laser6.mp3");
    assetLoader.add("SOUND", "Sounds/Correct_08_wav.wav");
    assetLoader.add("SOUND", "Sounds/Correct_06_wav.wav");
    assetLoader.add("SOUND", "Sounds/Tense_01_wav.wav");
    assetLoader.add("SOUND", "Sounds/Explosion_Sci_Fi_03_wav.wav");
    assetLoader.add("SOUND", "Sounds/Explosion_Sci_Fi_03_variation_01_wav.wav");
    assetLoader.add("SOUND", "Sounds/Explosion_Sci_Fi_03_variation_02_wav.wav");
    assetLoader.add("SOUND", "Sounds/Digital_panel_v1_wav.wav");
    assetLoader.add("SOUND", "Sounds/Digital_panel_v1_variation_02_wav.wav");
    assetLoader.add("SOUND", "Sounds/Digital_panel_v1_variation_01_wav.wav");
    assetLoader.add("SOUND", "Sounds/Rifle_v1_variation_02_wav.wav");
    assetLoader.add("SOUND", "Sounds/Click_Digital_06_wav.wav");
    assetLoader.add("SOUND", "Sounds/Hover_Digital_06_wav.wav");
    assetLoader.add("SOUND", "Sounds/Click_Digital_10_wav.wav");
    assetLoader.add("SOUND", "Sounds/Stinger_v2_wav.wav");

    assetLoader.add("SOUND", "Musics/bensound-highoctane.mp3");
    assetLoader.add("SOUND", "Musics/bensound-scifi.mp3");
    assetLoader.add("SOUND", "Musics/alexander-nakarada-loss.mp3");
    assetLoader.add("SOUND", "Musics/alexander-nakarada-we-are-victorious-finale.mp3");

    assetLoader.start(startGame);
}

function startGame() {
    sceneManager = new SceneManager();
    sceneManager.addScene("MENU", new MenuScene());
    sceneManager.addScene("LEVEL1", new Level1Scene());
    sceneManager.setCurrent("MENU");
    Services.register("SCENE", sceneManager);

    // On fait disparaitre les élément de chargement
    loaderImage.style.visibility = "hidden";
    loaderText.style.visibility = "hidden";

    gameReady = true;
    sceneManager.currentScene.show();
}

function update(dt) {
    if (!gameReady) {
        let loadRatio = Services.get("ASSET").getLoadedRatio();
        let ratio = Math.floor(loadRatio / 7 * 100);
        if (ratio < loaderImages.length) {
            loaderImage.src = loaderImages[ratio];
        }

        return;
    };

    sceneManager.update(dt);

    let inputListener = Services.get("INPUT");

    // Est-ce que l'on passe en affichage collideBox?
    if (inputListener.isPressed("KeyC")) {
        let parameters = Services.get("PARAMETER");
        parameters.setColliderDisplay(!parameters.colliderDisplay);
    }
}

function draw(context) {
    if (!gameReady) return;

    sceneManager.draw(context);
}

function run(tick) {
    requestAnimationFrame(run);

    // Calcul du deltaTime
    let dt = (tick - lastTick) / 1000

    // Gestion du framerate
    if (dt < (1 / wantedFps) - fpsTolerance) {
        return;
    }

    // Calcul des fps, moyenne sur les 5 dernières
    fps = 1 / dt;
    fpsList[fpsIndex++] = fps;
    fpsIndex %= 5;

    // GameLoop
    lastTick = tick;
    update(dt);
    drawContext.clearRect(0, 0, canvasInPage.width, canvasInPage.height);
    draw(drawContext);
}

function init() {
    drawContext.imageSmoothingEnabled = false;
    drawContext.msImageSmoothingEnabled = false;
    drawContext.webkitImageSmoothingEnabled = false;
    drawContext.mozImageSmoothingEnabled = false;
    load(canvasInPage);
    requestAnimationFrame(run);
}

init();
