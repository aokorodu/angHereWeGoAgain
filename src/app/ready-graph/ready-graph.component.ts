import { Component, OnInit } from '@angular/core';
import * as createjs from 'createjs-module';
import {PVector} from '../pvector';
import {TweenMax, Power2} from 'gsap';

@Component({
  selector: 'app-ready-graph',
  templateUrl: './ready-graph.component.html',
  styleUrls: ['./ready-graph.component.css']
})
export class ReadyGraphComponent implements OnInit {

  stage: any;
  backgroundFill: any = ['#212121', '#676767'];
  title: String = 'Readiness Calculator';
  stageWidth = 800;
  stageHeight = 800;
  margin = 20;
  graphHeight = this.stageHeight - (2 * this.margin);
  graphWidth = this.stageWidth - (2 * this.margin);

  vertLine: any;
  totalRows = 25;
  totalCols = 50
  points: number[];

  maxVal = 0;

  interest = .05;
  startVal = 100;

  graphContainer: any;
  graphLine: any;

  constructor() { }

  ngOnInit() {
    // to do
  }

  ngAfterViewInit() {
    this.initStage();
    this.initBG();
    this.initAxes();
    this.initGraphContainer();
    this.initHashLines();
    this.initVertLine();
    this.calcGraphPoints();
    this.plotGraphPoints();
    this.initTicker();
  }

  initTicker() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', this.draw.bind(this));
  }

  draw(evt) {
    this.stage.update(evt);
  }
  

  initStage() {
    this.stage = new createjs.Stage('graphCanvas');
    this.stage.on('pressmove', this.onStageMouseMove.bind(this));
  }

  initBG() {
    const bg = new createjs.Shape();
    bg.graphics.beginLinearGradientFill(this.backgroundFill, [0, 1], 0, 0, 0, this.stageHeight);
    bg.graphics.rect(0, 0, this.stageWidth, this.stageHeight);
    bg.cache(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChild(bg);
    
  }

  initAxes()
  {
    let sh = new createjs.Shape();
    sh.graphics.setStrokeStyle(2);
    sh.graphics.beginStroke("#FFFFFF99");
    sh.graphics.moveTo(this.margin, this.margin);
    sh.graphics.lineTo(20, this.stageHeight - 20);
    sh.graphics.lineTo(this.stageWidth - 20, this.stageHeight - 20);
    sh.graphics.endStroke();
    sh.cache(0,0, this.stageWidth, this.stageHeight);
    this.stage.addChild(sh);
  }

  initGraphContainer() {
    this.graphContainer = new createjs.Container();
    this.graphContainer.x = this.margin;
    this.graphContainer.y = this.stageHeight - this.margin;

    this.stage.addChild(this.graphContainer);
  }

  initHashLines() {
    for ( let col = 0; col < this.totalCols; col++) {
      let sh = new createjs.Shape();
      sh.graphics.setStrokeStyle(1);
      sh.alpha = .5;
      sh.graphics.beginStroke('#FFFFFF');
      sh.graphics.moveTo(0, 0);
      sh.graphics.lineTo(0, this.graphHeight);
      sh.graphics.endStroke();
      sh.cache(0, -1, 2, this.graphHeight);
      sh.x = ((col + 1) * this.graphWidth / this.totalCols);
      sh.y = -this.graphHeight;
      this.graphContainer.addChild(sh);
    }

    for ( let row = 0; row < this.totalRows; row++) {
      let sh = new createjs.Shape();
      sh.graphics.setStrokeStyle(0);
      sh.alpha = .2;
      sh.graphics.beginStroke('#FFFFFF');
      sh.graphics.moveTo(0, 0);
      sh.graphics.lineTo(this.graphWidth, 0);
      sh.graphics.endStroke();
      // sh.cache(0, -1, 2, this.graphHeight);
      sh.x = 0;
      sh.y = -(row * this.graphHeight / this.totalRows);
      this.graphContainer.addChild(sh);
    }
  }

  initVertLine() {
    this.vertLine = new createjs.Shape();
    this.vertLine.alpha = .4;
    this.vertLine.x = 100;
    this.vertLine.y = this.margin;
    this.vertLine.graphics.setStrokeStyle(10);
    this.vertLine.graphics.beginStroke("#FFFFFF");
    this.vertLine.graphics.moveTo(0, 0);
    this.vertLine.graphics.lineTo(0, this.graphHeight);
    this.vertLine.graphics.endStroke();
    this.vertLine.cache(-1, 0, -1, this.graphHeight)
    this.stage.addChild(this.vertLine);
  }

  calcGraphPoints() {

    // A = P (1 + r/n) ^ nt
    // A = startVal * (1 + 0.06/12) ^ 12col
    this.points = [];
    this.points.push(this.startVal);
    for ( let col = 1; col < this.totalCols; col++) {
      // let val = this.startVal * (1 + 0.06/12) ^ 12 * col;
      let val = this.startVal * Math.pow((1 + this.interest / 12), 12 * col) + (12 * col * .1);
      // Math.round(this.startVal * Math.pow(ror, col - 1) * Math.pow(ror, col));
      this.points.push(val);
    }

    this.maxVal = 12 * this.startVal; //this.points[this.points.length - 1];

  }

  plotGraphPoints() {
    let incrVal = this.maxVal / this.totalRows;
    if(this.graphLine == null) 
    {
      this.graphLine = new createjs.Shape();
      this.graphContainer.addChild(this.graphLine);
    }
    this.graphLine.graphics.clear();
    this.graphLine.graphics.setStrokeStyle(1);
    this.graphLine.alpha = 1;
    this.graphLine.graphics.beginStroke('#FFFFFF');
    this.graphLine.graphics.beginFill('#FFFFFF11')
    this.graphLine.graphics.moveTo(0, 0);
    console.log('---------------')
    for ( let col = 0; col < this.totalCols; col++) {
      var x = Math.round((col * this.graphWidth / this.totalCols));
      var y = -this.points[col]/this.maxVal * this.graphHeight;//  Math.round(this.points[col] * (this.maxVal / this.totalRows));
      console.log(this.points[col] + '- y: ' + y)
      this.graphLine.graphics.lineTo(x, y);
    }
    this.graphLine.graphics.lineTo(x, 0);
    this.graphLine.graphics.lineTo(0, 0);
    this.graphLine.graphics.endStroke();
  }

  onStageMouseMove(evt) {
    let scale = this.vertLine.x /  this.stageWidth;
    this.interest = .05 * scale;
    console.log(this.interest);
    this.calcGraphPoints();
    this.plotGraphPoints();
    this.vertLine.x = evt.stageX;
    //this.graphContainer.scaleX = this.graphContainer.scaleY = 1 + ( this.vertLine.x /  this.stageWidth);
  }

  zoom(num) {
    console.log(num);
    let scale = num / 10;
    TweenMax.to(this.graphContainer, .75, {scaleX: scale, scaleY: scale, ease: Power2.easeInOut});
}


}
