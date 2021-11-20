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
