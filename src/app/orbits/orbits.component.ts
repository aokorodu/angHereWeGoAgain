import { Component, OnInit } from '@angular/core';
import * as createjs from 'createjs-module';
import {OrbitGenerator} from './orbitGenerator';


@Component({
  selector: 'app-orbits',
  templateUrl: './orbits.component.html',
  styleUrls: ['./orbits.component.css']
})
export class OrbitsComponent implements OnInit {

  title: String = 'Orbits';
  stage: any;
  backgroundFill: any = ['#ffffff', '#e0e0e0'];
  og: OrbitGenerator;
  paused: Boolean = false;

  constructor() { }

  ngOnInit() {
    this.initStage();
    this.initBG();
    this.initParticles();
    this.initTicker();
  }

  initParticles() {
    this.og = new OrbitGenerator(200, this.stage);
    this.og.seed();
  }

  initStage() {
    this.stage = new createjs.Stage('orbitCanvas');
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
    this.og.update();
    this.stage.update(evt);
  }

  goHome() {
    console.log('Go Home');
    this.og.goHome();
  }

  remix() {
    console.log('Go Home');
    this.og.remix();
  }

  togglePause() {
    this.paused = this.og.togglePause();
  }

}
