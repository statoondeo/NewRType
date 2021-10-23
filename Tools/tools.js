
function isOutOfScreen(position, size) {
    let screen = ServiceLocator.getService(ServiceLocator.SCREEN);
    return position.x + size.x < 0 || position.x > screen.width || position.y + size.y < 0 || position.y > screen.height
}

function distance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
}