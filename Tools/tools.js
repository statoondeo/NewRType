
class Tools {
    static isOutOfScreen(position, size) {
        let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
        return position.x + size.x < 0 || position.x > screen.width || position.y + size.y < 0 || position.y > screen.height
    }

    static distance(pointA, pointB) {
        return ((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2) ** 0.5;
    }

    static normalize(vector) {
        // Normalisation du vecteur
        let normalization = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
        if (normalization != 0) {
            vector.x = vector.x / normalization;
            vector.y = vector.y / normalization;
        }
        return vector;
    }
}