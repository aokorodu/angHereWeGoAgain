import * as createjs from 'createjs-module';
import { PVector } from '../pvector';

export class OrbitBall{
    origin:PVector;
    location:PVector;
    velocity:PVector;
    accel:PVector;
    radius: number;
    shape: any;
    maxX:number;
    maxY:number;
    red:string;
    green:string;
    blue:string;
    colorString:string;
    c:string;

    goingHome:Boolean = false;

    constructor(x, y, stage){
      this.origin = new PVector(x,y);
      this.location = new PVector(x, y);
      this.velocity = new PVector(0,0);
      this.accel = new PVector(0,0);
      this.radius = 5;
      this.red = String(Math.round(Math.random()*255));
      this.green = "0";
      this.blue = String(Math.round(Math.random()*255));
      this.colorString = this.red + ',' + this.green + ',' +  this.blue
      this.c = 'rgba(' + this.colorString + ', .5)';
      this.shape = null;
      this.maxY = stage.canvas.height - this.radius;
      this.maxX = stage.canvas.width - this.radius;
      this.drawShape(stage);
    }

    move(v){
      this.accel.add(v);
      this.velocity.add(this.accel);
      this.accel.x = 0;
      this.accel.y = 0;
    }

    update(){
      if(this.goingHome == true) return;

      let targetV =   new PVector(this.maxX/2, this.maxY/2);
      targetV.sub(new PVector(this.location.x, this.location.y));
      targetV.normalize();
      targetV.multiply(.02);
      this.move(targetV);
      this.velocity.multiply(.9999);

      this.location.add(this.velocity);
      //this.bounce();
      this.shape.x = this.location.x;
      this.shape.y = this.location.y;
    }

    bounce(){
      if( this.location.x > this.maxX)
      {
        this.location.x = this.maxX;
        this.velocity.x *= -1
      } else if( this.location.x < this.radius)
      {
        this.location.x = this.radius;
        this.velocity.x *= -1
      }

      if(this.location.y > this.maxY)
      {
        this.location.y = this.maxY;
        this.velocity.y *= -1
      } else if(this.location.y < this.radius)
      {
        this.location.y = this.radius;
        this.velocity.y *= -1
      }
    }

    reset() {
      console.log('reset');
    }

    drawShape(stage) {
      console.log("drawShape")
      this.shape = new createjs.Shape()
      this.shape.graphics.beginFill(this.c);
      this.shape.graphics.beginStroke("rgba(255,255,255, .1)");
      this.shape.graphics.setStrokeStyle(1);
      this.shape.graphics.drawCircle(0, 0, this.radius);
      this.shape.cache(-this.radius,- this.radius, this.radius * 2, this.radius * 2); 
      stage.addChild(this.shape);
    }

    goHome() {
      if ( this.goingHome ) {
        return;
      }

      this.goingHome = true;
      createjs.Tween.get(this.shape).to({ x: this.origin.x, y: this.origin.y }, 2000, createjs.Ease.getPowInOut(4)).call(this.finishedGoingHome.bind(this));
    }

    remix() {
      if ( this.goingHome ) {
        return;
      }

      this.goingHome = true;

      let randomX = Math.random() * this.maxX;
      let randomY = Math.random() * this.maxY;

      createjs.Tween.get(this.shape).to({ x: randomX, y: randomY }, 2000, createjs.Ease.getPowInOut(4)).call(this.finishedRemixing.bind(this));
    }

    finishedRemixing() {
      this.origin.x = this.shape.x;
      this.origin.y = this.shape.y;

      this.finishedGoingHome();
    }

    finishedGoingHome() {
      console.log('finishedGoingHome');
      this.location.x = this.origin.x;
      this.location.y = this.origin.y;
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.accel.x = 0;
      this.accel.y = 0;
      this.goingHome = false;
    }
}
