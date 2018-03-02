import * as createjs from 'createjs-module';
import { PVector } from '../pvector';
import { OrbitBall} from './orbitBall';

export class OrbitGenerator{

    total: number;
    orbiters: OrbitBall[];
    stage: any;
    paused: Boolean = false;

  constructor(num, stage){
    this.total = num;
    this.orbiters = [];
    this.stage = stage;
  }

  togglePause(){
    this.paused = !this.paused;

    return this.paused;
  }

  seed(){
    for(let i = 0; i < this.total; i++){
      let x = Math.random() * this.stage.canvas.width;
      let y = Math.random() * this.stage.canvas.height;
      this.orbiters.push(new OrbitBall(x, y, this.stage));
    }
  }

  update(){
    if ( this.paused ) { return; }

    for(let i = 0; i < this.total; i++){
      this.orbiters[i].update();
    }
  }

  goHome(){
    for(let i = 0; i < this.total; i++){
        let o:OrbitBall = this.orbiters[i];
        o.goHome()
    }
  }

  remix() {
    for(let i = 0; i < this.total; i++){
      let o:OrbitBall = this.orbiters[i];
      o.remix()
    }
  }


}
