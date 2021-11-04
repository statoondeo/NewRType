class Easing {
    static easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
    }
}