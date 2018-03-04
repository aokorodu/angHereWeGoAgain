import { Component, OnInit } from '@angular/core';
import * as createjs from 'createjs-module';
import {SparkGenerator} from './sparkGenerator';

@Component({
  selector: 'app-sparks',
  templateUrl: './sparks.component.html',
  styleUrls: ['./sparks.component.css']
})
export class SparksComponent implements OnInit {

  title: String = 'Sparks';
  stage: any;
  backgroundFill: any = ['#6633FF', '#A266FF'];
  sg: SparkGenerator;

  constructor() { }

  ngOnInit() {
    this.initStage();
    this.initBG();
    this.initTicker();
    this.initSparkGen();
  }

  initSparkGen() {
    this.sg = new SparkGenerator(this.stage);
  }

  mousePressed() {
    this.sg.dropBall(this.stage.canvas.width / 2, 50);
}

  initStage() {
    this.stage = new createjs.Stage('sparksCanvas');
  }

  initBG() {
    const bg = new createjs.Shape();
    bg.graphics.beginLinearGradientFill(this.backgroundFill, [0, 1], 0, 0, 0, 400);
    bg.graphics.rect(0, 0, 400, 400);
    bg.cache(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChild(bg);
  }

  initTicker() {
    createjs.Ticker.addEventListener('tick', this.draw.bind(this));
  }

  draw(evt) {
    this.sg.update();
    this.stage.update(evt);
  }

}
