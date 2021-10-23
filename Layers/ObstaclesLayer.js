class ObstaclesLayer extends BaseLayer {
    constructor(speedRatio) {
        super(speedRatio);
        this.obstacles = new Manager();
    }

    addObstacle(obstacle) {
        this.obstacles.addItem(obstacle);
    }

    update(dt) {
        super.update(dt);
        console.log("ObstaclesLayer", this.currentGlobalStep)
        let obstacleToKill = [];
        this.obstacles.items.forEach(obstacle => {
            obstacle.currentStep = this.currentGlobalStep;
            obstacle.update(dt);
            if (obstacle.ended) {
                obstacleToKill.push(obstacle);
            }           
        });

        obstacleToKill.forEach(obstacle => {
            this.obstacles.deleteItem(obstacle);
        });
    }

    draw(context) {
        this.obstacles.items.forEach(obstacle => {
            if (obstacle.started) {
                obstacle.draw(context);
            }         
        });
    }
}