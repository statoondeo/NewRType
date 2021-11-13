class GreenSparkGameObject extends SparkGameObject {
    constructor() {
        super(Services.get(Services.ASSET).getImage("Images/greenspark.png"));
    }
                
    getClone() {
        return new GreenSparkGameObject();
    }
}
