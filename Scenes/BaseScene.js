class BaseScene {
    // Le scheduler est l'objet qui gère le déroulement du temps au sein de la scène
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.gameObjectsCollection = [];
    }

    // Tous les gameObjects sont gérés dans une liste triée
    // sur la couche sur laquelle il doivent apparaitre
    // afin de gérer les backgrounds et les foregrounds
    // La couche principale sur laquelle évoluent le joueur et 
    // les aliens est la couche 1.
    // Les backgrounds devront recevoir une valeur allant de 0 à 1 exclus
    // Les foregrounds devront recevoir une valeur supérieur à 1
    // Cette valeur représente aussi la vitesse de défilement du background/foreground
    addGameObject(gameObjet) {
        // // TODO : On cherche la place du nouvel élément dans le tableau
        // let index = 0;
        // while (index < this.gameObjectsCollection.length && gameObjet.layer > this.gameObjectsCollection[index]) {
        //     index++;
        // }
        // this.gameObjectsCollection.splice(index, 0, gameObjet);
        this.gameObjectsCollection.push(gameObjet);
        this.gameObjectsCollection.sort((a, b) => a.layer - b.layer);
        // console.log("Layers", this.gameObjectsCollection.join());
    }

    update(dt) {
        // On avance dans la scène
        this.scheduler.update(dt);

        // TODO : Comment gérer ces 3 états sans devoir parcourir la liste complète à chaque fois!

        // On ne traite que les gameObjects en activité
        // et on supprime les gameObjects qui sont obsolètes
        let gameObjectsToKillCollection = [];
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == GameObject.ACTIVE) {

                // Update du gameObject
                gameObject.update(dt);

                // Si il est devenu obsolète, on le marque comme étant à supprimer
                if (gameObject.status == GameObject.OUTDATED) {
                    gameObjectsToKillCollection.push(gameObject);
                }
            }
        });

        // On supprime tous les gameObjects obsolètes
        gameObjectsToKillCollection.forEach(gameObject => {
            let index = this.gameObjectsCollection.indexOf(gameObject);
            if (index >= 0) {
                this.gameObjectsCollection.splice(index, 1);
            }            
        });       
    }

    draw(context) {        
        // On ne dessine que les gameObjects en activité
        this.gameObjectsCollection.forEach(gameObject => {
            if (gameObject.status == GameObject.ACTIVE) {
                gameObject.draw(context);
            }
        });
    }
}