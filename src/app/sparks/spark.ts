import {PVector} from '../pvector';
import * as createjs from 'createjs-module';

export class Spark {
    location: PVector;
    accel: PVector;
    velocity: PVector;
    radius: number;
    fullSize: number;
    maxX: number;
    maxY: number;
    lifeSpan: number;
    stage: any;
    shape: any;

    constructor(x, y, maxX, maxY, stage) {
        this.location = new PVector(x, y);
        this.accel = new PVector(0, .1);
        this.velocity = new PVector(Math.random() * 20 - 10, Math.random() * 20  - 10);
        this.radius = 4;
        this.fullSize = 4;
        this.maxX = maxX;
        this.maxY = maxY;
        this.lifeSpan = 100;
        this.stage = stage;
        this.drawShape();
    }

    drawShape() {
        console.log('drawShape');
        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill('rgba(255, 0, 255, 200');
        this.shape.graphics.beginStroke('rgba(255, 0, 255, 255');
        this.shape.graphics.setStrokeStyle(4);
        this.shape.graphics.drawCircle(0, 0, this.radius);
        this.shape.cache(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        this.stage.addChild(this.shape);
      }

    resetVars() {
       // this.maxX = maxX - this.radius/2;
       // this.maxY = maxY - this.radius/2;
    }

    update() {
       if ( this.isDead()) {
           return;
       }
       this.lifeSpan--;
       this.radius *= .99;
       if ( this.radius < .5) {
           this.radius = .5;
       }
       this.velocity.add(this.accel);
       this.location.add(this.velocity);

       this.bounce();
    }

    isDead() {
        if ( this.lifeSpan <= 0) {
            return true;
        }

        return false;
    }

    bounce() {
        this.bounceX();
        this.bounceY();
    }

    bounceX() {
        if ( this.location.x > this.maxX - this.radius / 2) {
            this.location.x = this.maxX - this.radius / 2;
            this.velocity.x *= -1;
        } else if ( this.location.x < this.radius / 2) {
           this.location.x = this.radius / 2;
           this.velocity.x *= -1;
       }
    }

    bounceY() {
       if ( this.location.y > this.maxY - this.radius / 2) {
           this.location.y = this.maxY - this.radius / 2;
           this.velocity.y *= -.5;
       } else if ( this.location.y < this.radius / 2) {
          this.location.y = this.radius / 2;
          this.velocity.y *= -1;
      }

   }

    display() {
        if ( this.isDead()) {
            return;
        }
        let scale = this.radius / this.fullSize;
        this.shape.scaleX = scale;
        this.shape.scaleY = scale;
        this.shape.x = this.location.x;
        this.shape.y = this.location.y;
    }

    remove() {
        this.stage.remove(this.shape);
    }
}
