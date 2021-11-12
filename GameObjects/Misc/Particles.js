class Particle {
    constructor(image, position) {
        this.image = image;
        this.position = position.getClone();
        this.angle = Math.random() * 2 * Math.PI;
        this.rotation = Math.random() * 2 * Math.PI;
        this.speed = Math.random() * 40 + 20;
        this.ttl = Math.random() * 3 + 2;
        this.alive = true;
    }

    update(dt) {
        if (this.alive) {
            this.ttl -= dt;
            this.alive = this.ttl > 0;
            this.position.x += this.speed * Math.cos(this.angle) * dt;
            this.position.y += this.speed * Math.sin(this.angle) * dt;
        }
    }

    draw(context) {
        if (this.alive) {
            context.save();
            context.translate(this.position.x + this.image.width / 2, this.position.y + this.image.height / 2);
            context.rotate(this.rotation);
            context.globalAlpha = this.ttl / 5;
            context.drawImage(this.image, 0, 0);
            context.restore();
        }
    }
}
class ParticlesManager extends GameObject {
    constructor(position) {
        super();
        this.position = position.getClone();
        // On crée les particule prototype
        this.prototypes = [];
        this.prototypes.push(this.createPrototype(10, "red"));
        this.prototypes.push(this.createPrototype(20, "red"));
        this.prototypes.push(this.createPrototype(30, "red"));
        this.prototypes.push(this.createPrototype(10, "green"));
        this.prototypes.push(this.createPrototype(20, "green"));
        this.prototypes.push(this.createPrototype(30, "green"));
        this.prototypes.push(this.createPrototype(10, "blue"));
        this.prototypes.push(this.createPrototype(20, "blue"));
        this.prototypes.push(this.createPrototype(30, "blue"));

        this.create();
    }
    
    create() {
        this.particles = [];
        for (let index = 0; index < 50; index++) {
            this.particles.push(new Particle(this.prototypes[Math.floor(Math.random() * 9)], this.position));            
        }
    }

    createPrototype(size, color) {
        let canvas = ImageHandler.createCanvas(size, size);
        let context = canvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(0, 0, size, size);
        return canvas;
    }

    update(dt) {
        this.particles.forEach(particle => {
            particle.update(dt);
        });
    }

    draw(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
        });
    }
}