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

  // controls
  monthContLine: any;
  timeSliderLine: any;


  totalRows = 40;
  totalCols = 40;

  points: number[];
  optPoints: number[];
  pessPoints: number[];

  maxVal = 0;
  interest = .05;
  startVal = 50; // in thousands of dollars
  monthlyPayment = 0;

  graphContainer: any;
  graphLine: any;
  graphLine_Opt: any;
  graphLine_Pess: any;

  // text
  monthlyAmt: any;
  amountAtTimeText: any;

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
    this.calcDefaultGraphPoints();
    this.calcOptGraphPoints();
    this.calcPessGraphPoints();
    this.plotGraphPoints();
    this.plotOptGraphPoints();
    this.plotPessGraphPoints();
    this.initVertLine();
    this.initTimeSliderLine();
    this.initMonthlyText();
    this.initAmountAtTimeText();
    this.updateAmountTimeText();
    this.initTicker();
  }

  initMonthlyText() {
    this.monthlyAmt = new createjs.Text("Monthly Contribution:", "45px Helvetica", "#FFFFFF");
    this.monthlyAmt.x = this.margin;
    this.monthlyAmt.y = this.stageHeight - 100;
    this.stage.addChild(this.monthlyAmt);
    this.updateMonthlyText(5);
  }

  updateMonthlyText(num) {
    this.monthlyAmt.text = "Monthly Contribution: $" + num;
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
    this.monthContLine = new createjs.Shape();
    this.monthContLine.alpha = .4;
    this.monthContLine.x = this.margin;
    this.monthContLine.y = this.graphOrigin.y + 25;
    this.monthContLine.graphics.setStrokeStyle(30);
    this.monthContLine.graphics.beginStroke("#FFFFFF");
    this.monthContLine.graphics.moveTo(0, 0);
    this.monthContLine.graphics.lineTo(0, 75);
    this.monthContLine.graphics.endStroke();
    this.monthContLine.cache(-1, 0, -1, 75)
    this.stage.addChild(this.monthContLine);
  }

  initTimeSliderLine() {
    this.timeSliderLine = new createjs.Shape();
    this.timeSliderLine.alpha = .3;
    this.timeSliderLine.x = this.graphOrigin.x;
    this.timeSliderLine.y = this.graphOrigin.y;
    this.timeSliderLine.graphics.setStrokeStyle(20);
    this.timeSliderLine.graphics.beginStroke("#FF0000");
    this.timeSliderLine.graphics.moveTo(0, 0);
    this.timeSliderLine.graphics.lineTo(0, -this.graphHeight);
    this.timeSliderLine.graphics.endStroke();
    this.stage.addChild(this.timeSliderLine);
  }

  initAmountAtTimeText() {
    this.amountAtTimeText = new createjs.Text(`${this.points[0] * 1000}`, "24px Arial", "#FFFFFF");
    this.amountAtTimeText.textAlign = "center";
    this.amountAtTimeText.x = this.margin;
    this.amountAtTimeText.y = this.stageHeight/2;
    this.stage.addChild(this.amountAtTimeText);
  }

  updateAmountTimeText() {
    let xPos = this.timeSliderLine.x - this.margin;
    let num = Math.round(xPos /(this.graphWidth / this.totalCols));
    let amount = this.points[num] * 1000;
    let amountString = amount.toLocaleString();
    let yPos = -25 + this.graphOrigin.y - this.points[num]/this.maxVal * this.graphHeight;
    if(yPos < this.margin) yPos = this.margin;
    // this.amountAtTimeText.x = xPos;
    // this.amountAtTimeText.y = yPos;
    TweenMax.to(this.amountAtTimeText, .3, {x: xPos + this.margin, y: yPos});
    this.amountAtTimeText.text = "$" + amountString;
    console.log(amount);

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
    let st = this.startVal;
    for ( let col = 1; col < this.totalCols + 2; col++) {
      let val = (st * Math.pow((1 + this.interest / 12), 12 * col));
      this.points.push(Math.round(val));
      st += this.monthlyPayment;
    }
    this.maxVal = 500;//8 * this.startVal < 50 ? 50 : 8 * this.startVal;
  }

  calcOptGraphPoints() {

    this.optPoints = [];
    this.optPoints.push(this.startVal);
    let st = this.startVal;
    for ( let col = 1; col < this.totalCols + 2; col++) {
      let val = st * Math.pow((1 + (this.interest * 1.15) / 12), 12 * col);
      this.optPoints.push(val);
      st += this.monthlyPayment;
    }

  }

  calcPessGraphPoints() {

    this.pessPoints = [];
    this.pessPoints.push(this.startVal);
    let st = this.startVal;
    for ( let col = 1; col < this.totalCols + 2; col++) {
      let val = st * Math.pow((1 + (this.interest * 0.85) / 12), 12 * col);
      this.pessPoints.push(val);
      st += this.monthlyPayment;
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
    let yPos = Math.round(evt.stageY);
    let xPos = evt.stageX;
    
    // monthly contribution
    if(yPos > this.monthContLine.y && yPos < this.monthContLine.y + 75){
      let scale = (this.monthContLine.x - this.margin) /  this.graphWidth;
      this.monthlyPayment = 1 * scale;
      
      if(xPos > this.margin + this.graphWidth) {
        xPos = this.margin  +this.graphWidth;
      } else if(xPos < this.margin) {
        xPos = this.margin;
      }
      this.monthContLine.x = xPos;
      this.updateMonthlyText(Math.round(this.monthlyPayment * 1000));
      this.updateAmountTimeText();
      
    }

    // time slider
    if(yPos > this.margin && yPos < this.margin + this.graphHeight) {
      if(xPos < this.margin) {
        xPos = this.margin;
      }
      this.timeSliderLine.x = xPos;
      this.updateAmountTimeText();
    }
    this.drawGraphLines();

  }

  zoom(num) {
    let scale = 40 / num;
    TweenMax.to(this.graphContainer, .75, {scaleX: scale, scaleY: scale, ease: Power2.easeInOut});
}


}
