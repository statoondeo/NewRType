
function easeInCubic(number) {
    return number * number * number;
}

function easeOutCubic(number) {
    return 1 - Math.pow(1 - number, 3);
}

function easeInOutCubic(number) {
    return number < 0.5 ? 4 * number * number * number : 1 - Math.pow(-2 * number + 2, 3) / 2;
}

function easeInCirc(number) {
    return 1 - Math.sqrt(1 - Math.pow(number, 2));
}

function easeOutCirc(number) {
    return Math.sqrt(1 - Math.pow(number - 1, 2));
}

function easeInOutCirc(number) {
    return number < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * number, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * number + 2, 2)) + 1) / 2;
}