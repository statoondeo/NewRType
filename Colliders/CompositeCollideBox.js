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