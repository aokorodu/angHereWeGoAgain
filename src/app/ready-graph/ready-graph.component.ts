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
  bottomMargin = 200;
  graphHeight = this.stageHeight - this.margin - this.bottomMargin;
  graphWidth = this.stageWidth - (2 * this.margin);
  graphOrigin = new PVector(this.margin, this.margin + this.graphHeight);

  vertLine: any;
  totalRows = 40;
  totalCols = 40;

  points: number[];
  optPoints: number[];
  pessPoints: number[];

  maxVal = 0;
  interest = .05;
  startVal = 50; // in thousands of dollars

  graphContainer: any;
  graphLine: any;
  graphLine_Opt: any;
  graphLine_Pess: any;

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
    this.calcDefaultGraphPoints();
    this.calcOptGraphPoints();
    this.calcPessGraphPoints();
    this.plotGraphPoints();
    this.plotOptGraphPoints();
    this.plotPessGraphPoints();
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

  initAxes() {
    let strokeWidth = 2;
    let sh = new createjs.Shape();
    sh.x = this.graphOrigin.x;
    sh.y = this.graphOrigin.y;
    sh.graphics.setStrokeStyle(strokeWidth);
    sh.graphics.beginStroke("#FFFFFF99");
    sh.graphics.moveTo(0, 0);
    sh.graphics.lineTo(0, -this.graphHeight);
    sh.graphics.endStroke();
    sh.graphics.setStrokeStyle(strokeWidth);
    sh.graphics.beginStroke("#FFFFFF99");
    sh.graphics.moveTo(0, 0);
    sh.graphics.lineTo(this.graphWidth, 0);
    sh.graphics.endStroke();
    this.stage.addChild(sh);
  }

  initHashLines() {
    for ( let col = 0; col < this.totalCols; col++) {
      let sh = new createjs.Shape();
      sh.graphics.setStrokeStyle(0);
      sh.alpha = .5;
      sh.graphics.beginStroke('#FFFFFF');
      sh.graphics.moveTo(0, 0);
      sh.graphics.lineTo(0, -this.graphHeight);
      sh.graphics.endStroke();
      sh.x = ((col + 1) * this.graphWidth / this.totalCols);
      sh.y = 0;
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

  initGraphContainer() {
    this.graphContainer = new createjs.Container();
    this.graphContainer.x = this.graphOrigin.x;
    this.graphContainer.y = this.graphOrigin.y;

    this.stage.addChild(this.graphContainer);
  }

  initVertLine() {
    this.vertLine = new createjs.Shape();
    this.vertLine.alpha = .4;
    this.vertLine.x = 100;
    this.vertLine.y = this.graphOrigin.y + 50;
    this.vertLine.graphics.setStrokeStyle(30);
    this.vertLine.graphics.beginStroke("#FFFFFF");
    this.vertLine.graphics.moveTo(0, 0);
    this.vertLine.graphics.lineTo(0, 50);
    this.vertLine.graphics.endStroke();
    this.vertLine.cache(-1, 0, -1, 50)
    this.stage.addChild(this.vertLine);
  }

  drawGraphLines(){
    this.calcDefaultGraphPoints();
    this.calcOptGraphPoints();
    this.calcPessGraphPoints();
    this.plotGraphPoints();
    this.plotOptGraphPoints();
    this.plotPessGraphPoints();
  }

  calcDefaultGraphPoints() {
    // A = P (1 + r/n) ^ nt
    this.points = [];
    this.points.push(this.startVal);
    for ( let col = 1; col < this.totalCols + 2; col++) {
      let val = this.startVal * Math.pow((1 + this.interest / 12), 12 * col);
      this.points.push(val);
    }
    this.maxVal = 8 * this.startVal < 50 ? 50 : 8 * this.startVal;
  }

  calcOptGraphPoints() {

    this.optPoints = [];
    this.optPoints.push(this.startVal);
    for ( let col = 1; col < this.totalCols + 2; col++) {
      let val = this.startVal * Math.pow((1 + (this.interest * 1.15) / 12), 12 * col);
      this.optPoints.push(val);
    }

  }

  calcPessGraphPoints() {

    this.pessPoints = [];
    this.pessPoints.push(this.startVal);
    for ( let col = 1; col < this.totalCols + 2; col++) {
      let val = this.startVal * Math.pow((1 + (this.interest * 0.85) / 12), 12 * col);
      this.pessPoints.push(val);
    }

  }

  plotGraphPoints() {
    let incrVal = this.maxVal / this.totalRows;
    if(this.graphLine == null) 
    {
      this.graphLine = new createjs.Shape();
      this.graphContainer.addChild(this.graphLine);
    }
    this.graphLine.graphics.clear();
    this.graphLine.graphics.setStrokeStyle(0);
    this.graphLine.alpha = 1;
    this.graphLine.graphics.beginStroke('#FFFFFF');
    this.graphLine.graphics.beginFill('#FFFFFF11')
    this.graphLine.graphics.moveTo(0, 0);
    for ( let col = 0; col < this.points.length; col++) {
      var x = Math.round((col * this.graphWidth / this.totalCols));
      var y = -this.points[col]/this.maxVal * this.graphHeight;//  Math.round(this.points[col] * (this.maxVal / this.totalRows));
      this.graphLine.graphics.lineTo(x, y);
    }

    this.graphLine.graphics.lineTo(x, 0);
    this.graphLine.graphics.lineTo(0, 0);
    this.graphLine.graphics.endStroke();
  }

  plotOptGraphPoints() {
    let incrVal = this.maxVal / this.totalRows;
    if(this.graphLine_Opt == null) 
    {
      this.graphLine_Opt = new createjs.Shape();
      this.graphContainer.addChild(this.graphLine_Opt);
    }
    this.graphLine_Opt.graphics.clear();
    this.graphLine_Opt.graphics.setStrokeStyle(0);
    this.graphLine_Opt.alpha = 1;
    this.graphLine_Opt.graphics.beginStroke('#FFFFFF11');
    this.graphLine_Opt.graphics.beginFill('#FFFFFF11')
    this.graphLine_Opt.graphics.moveTo(0, 0);
    for ( let col = 0; col < this.optPoints.length; col++) {
      var x = Math.round((col * this.graphWidth / this.totalCols));
      var y = -this.optPoints[col]/this.maxVal * this.graphHeight;//  Math.round(this.points[col] * (this.maxVal / this.totalRows));
      this.graphLine_Opt.graphics.lineTo(x, y);
    }

    this.graphLine_Opt.graphics.lineTo(x, 0);
    this.graphLine_Opt.graphics.lineTo(0, 0);
    this.graphLine_Opt.graphics.endStroke();
  }

  plotPessGraphPoints() {
    let incrVal = this.maxVal / this.totalRows;
    if(this.graphLine_Pess == null) 
    {
      this.graphLine_Pess = new createjs.Shape();
      this.graphContainer.addChild(this.graphLine_Pess);
    }
    this.graphLine_Pess.graphics.clear();
    this.graphLine_Pess.graphics.setStrokeStyle(0);
    this.graphLine_Pess.alpha = 1;
    this.graphLine_Pess.graphics.beginStroke('#FFFFFF11');
    this.graphLine_Pess.graphics.beginFill('#FFFFFF11')
    this.graphLine_Pess.graphics.moveTo(0, 0);
    for ( let col = 0; col < this.pessPoints.length; col++) {
      var x = Math.round((col * this.graphWidth / this.totalCols));
      var y = -this.pessPoints[col]/this.maxVal * this.graphHeight;
      this.graphLine_Pess.graphics.lineTo(x, y);
    }

    this.graphLine_Pess.graphics.lineTo(x, 0);
    this.graphLine_Pess.graphics.lineTo(0, 0);
    this.graphLine_Pess.graphics.endStroke();
  }

  onStageMouseMove(evt) {
    let scale = this.vertLine.x /  this.stageWidth;
    this.interest = .05 * scale;
    this.drawGraphLines();
    this.vertLine.x = evt.stageX;
    //this.graphContainer.scaleX = this.graphContainer.scaleY = 1 + ( this.vertLine.x /  this.stageWidth);
  }

  zoom(num) {
    let scale = num / 10;
    TweenMax.to(this.graphContainer, .75, {scaleX: scale, scaleY: scale, ease: Power2.easeInOut});
}


}
