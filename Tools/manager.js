
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