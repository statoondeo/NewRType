class RedSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).getImage("Images/redspark.png"));
    }
        
    getClone() {
        return new RedSparkGameObject();
    }
}
