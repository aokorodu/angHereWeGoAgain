import * as createjs from 'createjs-module';
import {Ball} from './ball';
import {Spark} from './Spark';

export class SparkGenerator {

    stage: any;
    balls: any;
    particles: any;
    totalParticles: number;

    constructor(stage) {
        this.stage = stage;
        this.balls = [];
        this.particles = [];
        this.totalParticles = 8;

        this.dropBall(200, 50);
    }

    dropBall(x, y) {
        this.balls.push( new Ball(x, y, this.stage.canvas.width, this.stage.canvas.height, this.stage));
    }

    update() {
        for ( let b of this.balls) {
            if ( !b.isDead()) {
                if ( b.update()) {
                    this.explode(b);
                }
                b.display();
            } else {
                this.balls.splice( this.balls.indexOf(b), 1);
            }
        }

        for ( let p of this.particles) {
            if ( p.isDead()) {
                this.particles.splice( this.particles.indexOf(p), 1);
                this.stage.removeChild(p.shape)
            } else {
                p.update();
                p.display();
            }
        }
    }

    explode(b) {
        for ( let i = 0; i < this.totalParticles; i++ ) {
            this.particles.push(new Spark(b.location.x, b.location.y, this.stage.canvas.width, this.stage.canvas.height, this.stage));
        }
    }
}
