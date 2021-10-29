class Easing {
    static easeInCubic(number) {
        return 4 * number * number * number;
    }

    static easeOutCubic(number) {
        return 1 - Math.pow(1 - number, 3);
    }

    static easeInOutCubic(number) {
        return number < 0.5 ? number * number * number : 1 - Math.pow(-2 * number + 2, 3) / 2;
    }

    static easeInCirc(number) {
        return 1 - Math.sqrt(1 - Math.pow(number, 2));
    }

    static easeOutCirc(number) {
        return Math.sqrt(1 - Math.pow(number - 1, 2));
    }

    static easeInOutCirc(number) {
        return number < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * number, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * number + 2, 2)) + 1) / 2;
    }
}