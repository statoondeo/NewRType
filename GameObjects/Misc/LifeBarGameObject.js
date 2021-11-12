class LifeBarGameObject extends AnimatedSprite {
    static size = new Vec2(472, 99);
    constructor() {
        super(ServiceLocator.getService(ServiceLocator.RESOURCE).getImage("Images/Gui/lifeBar.png"), LifeBarGameObject.size);

        this.addAnimation(new Animation("0Life", [0], 0, false));
        this.addAnimation(new Animation("1Life", [1], 0, false));
        this.addAnimation(new Animation("2Life", [2], 0, false));
        this.addAnimation(new Animation("3Life", [3], 0, false));
        this.addAnimation(new Animation("4Life", [4], 0, false));
        this.addAnimation(new Animation("5Life", [5], 0, false));
        this.addAnimation(new Animation("6Life", [6], 0, false));
        this.addAnimation(new Animation("7Life", [7], 0, false));
        this.addAnimation(new Animation("8Life", [8], 0, false));
        this.addAnimation(new Animation("9Life", [9], 0, false));
        this.addAnimation(new Animation("10Life", [10], 0, false));
        this.addAnimation(new Animation("11Life", [11], 0, false));
        this.addAnimation(new Animation("12Life", [12], 0, false));
        this.addAnimation(new Animation("13Life", [13], 0, false));
        this.addAnimation(new Animation("14Life", [14], 0, false));
        this.startAnimation("14Life", 0);
    }

    setRatio(ratio) {
        let animation =  Math.floor(ratio / 7 * 100) + "Life";
        this.startAnimation(animation, 0);
    }
}
