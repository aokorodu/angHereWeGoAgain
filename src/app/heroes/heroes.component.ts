import { Component, AfterViewInit } from '@angular/core';
import * as createjs from 'createjs-module';
import {Hero} from './hero';
import {ParticleGenerator} from './particleGenerator';
import {PVector} from '../pvector';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements AfterViewInit {
  stage: any;
  pg: ParticleGenerator;
  paused: Boolean = false;
  off: Boolean = false;
  floor: Boolean = false;
  backgroundFill: any = ['#00A57C', '#00FFCC'];
  title: String = 'Particles';
  gravity: Number;
  floorShape: any;


  constructor() {
  }

  ngAfterViewInit() {
    this.initStage();
    this.initBG();
    this.initFloor();
    this.initParticles();
    this.initTicker();
  }

  initStage() {
    this.stage = new createjs.Stage('particleCanvas');
    this.stage.on('pressmove', this.onParticleStageMouseDown.bind(this));
  }

  initBG() {
    const bg = new createjs.Shape();
    //bg.graphics.beginLinearGradientFill(this.backgroundFill, [0, 1], 0, 0, 0, 400);
    bg.graphics.beginRadialGradientFill(this.backgroundFill, [1, 0], 200, 100, 0, 200, 100, 300);
    bg.graphics.rect(0, 0, 400, 400);
    bg.cache(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChild(bg);
  }

  initFloor() {
    this.floorShape = new createjs.Shape();
    this.floorShape.graphics.beginFill('#444444');
    this.floorShape.graphics.rect(0, 0, this.stage.canvas.width, 2);
    this.floorShape.cache(0, 0, this.stage.canvas.width, 2);
    this.floorShape.y = this.stage.canvas.height - 2;
    this.floorShape.alpha = 0;
    this.stage.addChild(this.floorShape);

  }

  initParticles() {
    this.pg = new ParticleGenerator(this.stage.canvas.width / 2, 100, this.stage, 200);
  }

  initTicker() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', this.draw.bind(this));
  }

  togglePause(evt) {
    this.paused = this.pg.togglePause();
  }

  toggleOff() {
    this.off = this.pg.toggleOff();
  }

  toggleFloor() {
    this.floor = this.pg.toggleFloor();
    this.floorShape.alpha = this.floor;
  }

  onParticleStageMouseDown() {
    const diffX = (this.stage.mouseX - 200) / 400;
    const diffY = (this.stage.mouseY - 200) / 400;
    this.pg.applyForce(new PVector(diffX, diffY) );
  }

  draw(evt) {
    this.pg.update();
    this.stage.update(evt);
  }
}
