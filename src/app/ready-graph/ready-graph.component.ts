import { Component, OnInit } from '@angular/core';
import * as createjs from 'createjs-module';
import {PVector} from '../pvector';

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
  stageHeight = 400;
  margin = 20;
  graphHeight = this.stageHeight - (2 * this.margin);
  graphWidth = this.stageWidth - (2 * this.margin);

  vertLine: any;
  totalRows = 25;
  totalCols = 50
  points: number[];

  maxVal = 0;



  constructor() { }

  ngOnInit() {
    // to do
  }

  ngAfterViewInit() {
    this.initStage();
    this.initBG();
    this.initAxes()
    this.initHashLines();
    this.initVertLine();
    this.calcGraphPoints();
    this.plotGraphPoints();
    this.stage.update();
    
  }

  initStage() {
    this.stage = new createjs.Stage('graphCanvas');
    this.stage.on('pressmove', this.onStageMouseMove.bind(this));
  }

  initBG() {
    const bg = new createjs.Shape();
    bg.graphics.beginLinearGradientFill(this.backgroundFill, [0, 1], 0, 0, 0, this.stageHeight);
    bg.graphics.rect(0, 0, 800, 400);
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
      sh.x = this.margin + ((col + 1) * this.graphWidth / this.totalCols);
      sh.y = this.margin;
      this.stage.addChild(sh);
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
      sh.x = this.margin;
      sh.y = this.margin + (row * this.graphHeight / this.totalRows);
      this.stage.addChild(sh);
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
    let startVal = 10;
    let ror = 1.06;
    this.points = [];
    this.points.push(startVal);
    for ( let col = 1; col < this.totalCols; col++) {
      // let val = startVal * (1 + 0.06/12) ^ 12 * col;
      let val = startVal * Math.pow((1 + 0.06 / 12), 12 * col);
      // Math.round(startVal * Math.pow(ror, col - 1) * Math.pow(ror, col));
      this.points.push(val);
      console.log(val);
    }

    this.maxVal = this.points[this.points.length - 1];

  }

  plotGraphPoints() {
    let incrVal = this.maxVal / this.totalRows;
    let sh = new createjs.Shape();
    sh.x = this.margin;
    sh.y = this.stageHeight - this.margin;
    sh.graphics.setStrokeStyle(1);
    sh.alpha = 1;
    sh.graphics.beginStroke('#FFFFFF');
    sh.graphics.moveTo(0, 0);
    for ( let col = 0; col < this.totalCols; col++) {
      let x = Math.round((col * this.graphWidth / this.totalCols));
      let y = -this.points[col]/this.maxVal * this.graphHeight;//  Math.round(this.points[col] * (this.maxVal / this.totalRows));
      sh.graphics.lineTo(x, y);
      console.log('x: ' + x + ' y: ' + y);
    }
    sh.graphics.endStroke();
    this.stage.addChild(sh);
  }

  onStageMouseMove(evt) {
    this.vertLine.x = evt.stageX;
    this.stage.update();
  }

}
