import * as createjs from 'createjs-module';
import { PVector } from '../pvector';

export class Slider {

    width: number;
    height: number;
    lever: any;
    x: number;
    y: number;
    stage: any;
    maxX: number;

    constructor(x, y, width, height, stage) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxX = this.x + this.width;
        this.stage = stage;
    }

    init() {
        this.drawTrack();
        this.drawLever();
    }

    setInitialPosition(num) {
        this.lever.x = this.x + (this.width * num);
    }

    drawLever() {
        this.lever = new createjs.Shape();
        this.lever.alpha = .5;
        this.lever.graphics.setStrokeStyle(20);
        this.lever.graphics.beginStroke('#FFFFFF');
        this.lever.graphics.moveTo(0, 0);
        this.lever.graphics.lineTo(0, this.height);
        this.lever.graphics.endStroke();
        this.lever.x = this.x;
        this.lever.y = this.y;
        this.stage.addChild(this.lever);
    }

    drawTrack() {
        let sh = new createjs.Shape();
        sh.alpha = .25;
        sh.graphics.setStrokeStyle(5);
        sh.graphics.beginStroke('#222222');
        sh.graphics.moveTo(0, 0);
        sh.graphics.lineTo(this.width, 0);
        sh.x = this.x;
        sh.y = this.y + this.height / 2;

        this.stage.addChild(sh);
    }

    isOver(x, y) {
        if(y - this.y > 0 && y < this.y + this.height) {
            if(x < this.x) {
                x = this.x;
            } else if(x > this.maxX) {
                x = this.maxX;
            }
            this.lever.x = x;
            return true;
        }

        return false;
    }

    scale() {
        return (this.lever.x - this.x) / this.width;
    }
}
