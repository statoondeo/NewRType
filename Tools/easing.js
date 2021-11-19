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