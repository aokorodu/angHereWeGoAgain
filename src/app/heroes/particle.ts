import * as createjs from 'createjs-module';
import { PVector } from '../pvector';

export class Particle {
    origin: PVector;
    location: PVector;
    velocity: PVector;
    accel: PVector;
    radius: number;
    shape: any;
    maxX: number;
    maxY: number;
    red: string;
    green: string;
    blue: string;
    colorString: string;
    c: string;
    lifeSpan: number;
    maxLifeSpan: number;
    scaleIncrement: number;
    hasFloor: Boolean;

    constructor(x, y, stage) {
        this.origin = new PVector(x,y);
        this.location = new PVector(x, y);
        this.velocity = new PVector(Math.random() * 8 - 4, Math.random() * 8 - 4);
        this.accel = new PVector(0,0);
        this.radius = 5;
        this.red = String(Math.round(Math.random()*200));
        this.green = "200";
        this.blue = String(Math.round(Math.random()*200));
        this.colorString = this.red + ',' + this.green + ',' +  this.blue;
        this.c = 'rgba(' + this.colorString + ', .85)';
        this.maxLifeSpan = 200;
        this.lifeSpan = this.maxLifeSpan;
        this.scaleIncrement = Math.random() > .5 ? .005 : -.005;
        this.maxX = stage.canvas.width;
        this.maxY = stage.canvas.height - this.radius;
        this.hasFloor = false;
        this.drawShape(stage);
    }

    drawShape(stage){
        this.shape = new createjs.Shape()
        this.shape.graphics.beginFill(this.c);
        this.shape.graphics.beginStroke("rgba(0,0, 0,.25)");
        this.shape.graphics.setStrokeStyle(3);
        this.shape.graphics.drawCircle(0, 0, this.radius);
        stage.addChild(this.shape);
      }

    /*update() {
        this.velocity.add(this.accel);
        this.location.add(this.velocity);
        this.bounce();
        this.shape.x = this.location.x;
        this.shape.y = this.location.y;
    }*/

    move(v){
        this.accel.add(v);
        this.velocity.add(this.accel);
        this.accel.x = 0;
        this.accel.y = 0;
      }

    update(){
        if(this.lifeSpan < 0) return;
        this.lifeSpan--;
        this.location.add(this.velocity);
        this.bounce();

        this.shape.x = this.location.x;
        this.shape.y = this.location.y;
        this.shape.alpha = (this.lifeSpan * 10)/this.maxLifeSpan;
        this.shape.scaleX -= this.scaleIncrement;
        this.shape.scaleY -= this.scaleIncrement;

        //pop();
      }

    bounce(){
        if(this.location.x > this.maxX){
          this.location.x = this.maxX;
          this.velocity.x *= -1;
        } else if(this.location.x < this.radius){
          this.location.x = this.radius;
          this.velocity.x *= -1;
        }

        if(!this.hasFloor) return;

        if(this.location.y > this.maxY){
          if(this.location.y - this.maxY > this.radius){
            //this.lifeSpan = -1;
          } else {
            this.location.y = this.maxY;
            this.velocity.y *= -1;
          }
        }
      }

      reset() {
        this.location.x = this.origin.x;
        this.location.y = this.origin.y;
        this.shape.scaleX = 1;
        this.shape.scaleY = 1;
        this.velocity = new PVector(Math.random() * 4 - 2, Math.random() * 8 - 4);
        this.accel = new PVector(0,0);
        this.lifeSpan = this.maxLifeSpan;
        if(this.radius++ > 20){
            this.radius = 2;
        }
      }

      get isDead(){
        if(this.lifeSpan < 0)
        {
          return true;
        }

        return false;
      }
}

