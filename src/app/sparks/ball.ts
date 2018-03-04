import * as createjs from 'createjs-module';
import { PVector } from '../pvector';

export class Ball {
    location: PVector;
    accel: PVector;
    velocity: PVector;
    maxX: number;
    maxY: number;
    radius: number;
    fullSize: number;
    growing: Boolean = true;
    shape: any;

 constructor(x, y, maxX, maxY, stage) {
  this.location = new PVector(x, y);
  this.accel = new PVector(0, .5);
  this.velocity = new PVector(Math.random() * 6 - 3, Math.random() * 10 - 5);
  this.maxX = maxX;
  this.maxY = maxY;
  this.radius = 4;
  this.fullSize = 20;
  this.growing = true;

  this.drawShape(stage);
 }

 drawShape(stage) {
    console.log('drawShape');
    this.shape = new createjs.Shape();
    this.shape.graphics.beginFill('rgba(255, 0, 255, .5');
    this.shape.graphics.beginStroke('rgba(255, 0, 255, 255');
    this.shape.graphics.setStrokeStyle(4);
    this.shape.graphics.drawCircle(0, 0, this.fullSize);
    this.shape.cache(-this.fullSize * 1.5, -this.fullSize * 1.5, this.fullSize * 3, this.fullSize * 3);
    this.shape.x = this.location.x;
    this.shape.y = this.location.y;
    stage.addChild(this.shape);
  }

 resetVars() {
    //
 }

 update() {
    this.velocity.add(this.accel);
    this.location.add(this.velocity);
    if ( this.growing ) {
        if ( this.radius++ === this.fullSize) {
            this.growing = false;
        }
    }
    this.shape.scaleX = this.shape.scaleY = this.radius / this.fullSize;
    return this.bounce();
 }

 isDead() {
     if ( this.radius === 0) {
        return true;
     }

     return false;
 }

 break() {
     if ( !this.growing) {
         this.radius -= 2;
     }
     if ( this.radius <= 0) {
         this.radius = 0;
     }
     this.resetVars();
 }

 bounce() {
     if ( this.bounceX() || this.bounceY()) {
         return true;
     }

     return false;
 }

 bounceX() {
     if ( this.location.x > this.maxX - this.radius / 2) {
         this.location.x = this.maxX - this.radius / 2;
         this.velocity.x *= -1;
         this.break();
         return true;
     } else if ( this.location.x < this.radius / 2) {
        this.location.x = this.radius / 2;
        this.velocity.x *= -1;
        this.break();
        return true;
    }

    return false;
 }

 bounceY() {
    if ( this.location.y > this.maxY - this.radius / 2) {
        this.location.y = this.maxY - this.radius / 2;
        this.velocity.y *= -.85;
        this.break();
        return true;
    }

   return false;
}

 display() {
     if ( this.radius === 0) {
         return;
     }

     this.shape.x = this.location.x;
     this.shape.y = this.location.y;

 }
}
