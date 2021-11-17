// Permet de piloter la vitesse de la scène afin de l'accélérer ou de la ralentier à souhait
class AdaptativeScheduler extends LinearScheduler {
    constructor(speed, startingStep) {
        super(speed, startingStep);
    }

    update(dt) {
        // Pour tester
        // Est-ce qu'on accélère ou ralenti la scène?
        if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyQ")) {
            this.baseSpeed *= 1.1;
        }
        if (ServiceLocator.getService(ServiceLocator.KEYBOARD).isPressed("KeyA")) {
            this.baseSpeed *= 0.9;
        }

        // Avancement linéaire du currentStep
        super.update(dt);
    }
}
