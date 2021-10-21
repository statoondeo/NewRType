
function isOutOfScreen(screen, position, size) {
    return (position.x + size.x < 0 || position.x > screen.width || position.y + size.y < 0 || position.y > screen.height)
}