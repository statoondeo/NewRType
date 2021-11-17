
class Tools {
    static isOutOfScreen(position, size) {
        let screen = Services.get(Services.SCREEN);
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

