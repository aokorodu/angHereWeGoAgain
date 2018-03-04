import { Component, OnInit } from '@angular/core';
import * as createjs from 'createjs-module';
import {PVector} from '../pvector';

@Component({
  selector: 'app-title-anim',
  templateUrl: './title-anim.component.html',
  styleUrls: ['./title-anim.component.css']
})
export class TitleAnimComponent implements OnInit {

  stage: any;
  backgroundFill: any = ['#03B2ED', '#036C8B'];
  logo: any;
  subtitle: any;
  orbitGraphic: any;
  shapeHolder: any;

  radius: number;
  radiusIncrement: number;
  angle: number;
  angleIncrement: number;
  index: number;
  totalShapes: number;
  theShapes: any;
  thePositions: PVector[];

  delay = 0;
  deelayDuration = 300;

  circles:boolean;


  constructor() { }

  ngOnInit() {
    this.initProps();
    this.initStage();
    this.initBG();
    this.initShapeHolder();
    this.drawCircles();
    this.setPositions();
    this.initGraphics();
    this.showLogo();
    this.initTicker();
  }

  initProps() {
    this.resetProps();
    this.circles = true;
    this.totalShapes = 200;
    this.thePositions = [];
    this.theShapes = [];
  }

  resetProps() {
    this.radius = Math.random() * 20 + 20;
    this.radiusIncrement = 1 + Math.random() * 2;
    this.angle = 0;
    this.angleIncrement = Math.random() * (137.5 * Math.PI/180);
    this.index = 0;
  }

  initShapeHolder() {
    this.shapeHolder = new createjs.Container();
    this.shapeHolder.x = this.stage.canvas.width / 2;
    this.shapeHolder.y = this.stage.canvas.height / 2;
    this.stage.addChild(this.shapeHolder);
    this.shapeHolder.scaleX = this.shapeHolder.scaleY = .8;
    
  }

  drawCircles() {
    
    /*for ( let i = 0; i < this.totalShapes; i++ ) {
      let sh = new createjs.Shape();
      sh.alpha = .075;
      sh.graphics.setStrokeStyle(4);
      sh.graphics.beginStroke("#FFffff88")
      sh.graphics.beginFill('#FFFFFF99')
      sh.graphics.drawCircle(0, 0, this.radius);
      //sh.graphics.drawRoundRect(-this.radius/2, -this.radius/2, this.radius, this.radius, this.radius/4);
      this.shapeHolder.addChild(sh);
      this.theShapes.push(sh);
      this.radius -= .1;
    }*/

    for ( let i = 0; i < this.totalShapes; i++ ) {
      let sh = new createjs.Shape();
      sh.alpha = .075;
      sh.graphics.setStrokeStyle(4);
      sh.graphics.beginStroke("#FFffff88")
      sh.graphics.beginFill('#FFFFFF99')
      sh.graphics.drawCircle(0, 0, this.radius);
      //sh.graphics.drawRoundRect(-this.radius/2, -this.radius/2, this.radius, this.radius, this.radius/4);
      this.shapeHolder.addChild(sh);
      this.theShapes.push(sh);
      this.radius -= .1;
    }
  }

  changeShapes() {
    this.circles = !this.circles;
    this.resetProps();
    for(let i = 0; i < this.totalShapes; i++){
      let sh = this.theShapes[i];
      sh.graphics.clear();
      sh.graphics.setStrokeStyle(2);
      sh.graphics.beginStroke("#FFffff88")
      sh.graphics.beginFill('#FFFFFF99')
      sh.alpha = .1;
      if ( this.circles ) {
        sh.graphics.drawCircle(0, 0, this.radius);
      } else {
        sh.graphics.setStrokeStyle(2);
        sh.graphics.drawRect(-this.radius, -this.radius, this.radius*2, this.radius*2);
      }

      this.radius -= .1;
    }
  }


  setPositions() {
    let randomScale = Math.random() + 1;
    for ( let i = 0; i < this.totalShapes; i++ ) {
      let x = Math.cos(this.angle) * this.radius;
      let y = Math.sin(this.angle) * this.radius;
      this.thePositions[i] = (new PVector(x, y));
      this.angle += this.angleIncrement;
      this.radius += this.radiusIncrement;

      //this.theShapes[i].x = x;
      //this.theShapes[i].y = y;

      createjs.Tween.get(this.theShapes[i]).to({ x: x, y: y, scaleX:randomScale, scaleY:randomScale }, 1000, createjs.Ease.getPowInOut(4));
      randomScale -= randomScale / this.totalShapes;
    }
  }

  initStage() {
    this.stage = new createjs.Stage('titleAnimationCanvas');
  }

  initBG() {
    const bg = new createjs.Shape();
    bg.graphics.beginLinearGradientFill(this.backgroundFill, [0, 1], 0, 0, 0, 400);
    //bg.graphics.beginRadialGradientFill(this.backgroundFill, [1, 0], 200, 200, 100, 200, 200, 400);
    bg.graphics.rect(0, 0, 400, 400);
    bg.cache(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChild(bg);
  }

  initGraphics() {
    this.logo = new createjs.Bitmap('../assets/images/REV_Logo.png');
    this.logo.alpha = 0;
    this.stage.addChild(this.logo);

    this.subtitle = new createjs.Bitmap('../assets/images/REV_Logo_subtitle.png');
    this.subtitle.alpha = 0;
    this.stage.addChild(this.subtitle);

    /*this.orbitGraphic = new createjs.Container();
    this.orbitGraphic.alpha = 0;
    this.orbitGraphic.x = this.orbitGraphic.y = this.stage.canvas.width / 2;
    let orbitBM = new createjs.Bitmap('../assets/images/orbit.png');
    orbitBM.x = -this.stage.canvas.width / 2;
    orbitBM.y = -this.stage.canvas.width / 2;
    this.orbitGraphic.scaleX = this.orbitGraphic.scaleY = .01;
    this.orbitGraphic.addChild(orbitBM);
    this.orbitGraphic.alpha = .0;
    this.stage.addChild(this.orbitGraphic);*/
  }

  showLogo() {
   /* var animTimeline = new createjs.Timeline([createjs.Tween.get(this.logo).wait(1000)
      .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4)),
      createjs.Tween.get(this.subtitle).wait(2000)
      .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4)),
      createjs.Tween.get(this.orbitGraphic).wait(0)
      .to({ alpha: .4, scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.getPowInOut(4))], {}, {});
      animTimeline.setPaused(false);
      animTimeline.loop = false;*/

      var animTimeline = new createjs.Timeline([createjs.Tween.get(this.logo).wait(1000)
        .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4)),
        createjs.Tween.get(this.subtitle).wait(2000)
        .to({ alpha: 1 }, 1000, createjs.Ease.getPowInOut(4))], {}, {});
  }

  initTicker() {
    createjs.Ticker.addEventListener('tick', this.draw.bind(this));
  }

  reset() {
    this.delay = 0;
    this.resetProps();
    this.setPositions();
  }

  draw(evt) {
    this.delay += 1;
    if ( this.delay === this.deelayDuration ) {
      this.reset();
    }
    this.shapeHolder.rotation += .1;
    this.stage.update(evt);
  }

}
