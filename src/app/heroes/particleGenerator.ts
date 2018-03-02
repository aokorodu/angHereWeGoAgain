import * as createjs from 'createjs-module';
import { PVector } from '../pvector';
import { Particle } from './particle';

export class ParticleGenerator{
    location: PVector;
    particles: Particle[];
    gravity: PVector;
    wind: PVector;
    totalParticles: number;
    stage: any;
    stopped: boolean;
    paused: boolean;
    particleHolder: Particle[];
    hasFloor: Boolean;
    friction:Boolean;

    constructor(x, y, stage, totalParticles) {
      this.location = new PVector(x, y)
      this.particles = [];
      this.particleHolder = [];
      this.gravity = new PVector(0, .1);
      this.wind = new PVector(.1, 0);
      this.totalParticles = totalParticles;
      this.stage = stage;
      this.stopped = false;
      this.paused = false;

      this.hasFloor = false;
      this.friction = false;

    }

    toggleFloor() {
      this.hasFloor = !this.hasFloor;
      for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];
        p.hasFloor = this.hasFloor ;
      }

      for (let i = 0; i < this.particleHolder.length; i++) {
        let p = this.particleHolder[i];
        p.hasFloor = this.hasFloor ;
      }

      return this.hasFloor;
    }

    toggleOff() {
      this.stopped ? this.startParticles() : this.stopParticles();

      return this.stopped;
    }

    togglePause() {
      this.paused = !this.paused;

      return this.paused;
    }

    stopParticles() {
      this.stopped = true;
    }

    startParticles() {
      this.reset()
      this.stopped = false;
    }

    reset() {
      for (let i = 0; i < this.particles.length; i++)
      {
        let p = this.particles[i];
          p.reset();
      }

      this.particleHolder = [...this.particles];
      this.particles = [];
    }

    launchParticle() {
      if(this.stopped) return;

      if(this.particles.length < this.totalParticles)
      {
        if(this.particleHolder.length > 0)
        {
          this.particles.push(this.particleHolder.pop());
        } else{
          this.particles.push(new Particle(this.location.x, this.location.y, this.stage));
        }
  
        //console.log(this.particles.length, " of ", this.totalParticles)
      }
    }
    applyForce(v){
      if(this.stopped) return;
  
      for(let i = 0; i < this.particles.length; i++)
      {
        let p = this.particles[i];
        if(p.isDead)
        {
          p.reset();
        }
        p.move(v);
      }
    }

    update(){
      if ( this.paused ) { return; }

      this.launchParticle();
      this.moveParticles();
    }

    moveParticles(){
      for(let i = 0; i < this.particles.length; i++)
      {
        let p = this.particles[i];
        if(p.isDead && !this.stopped)
        {
          p.reset();
        }
        p.move(this.gravity);
        if(this.friction){
          let frictionForce:PVector = PVector.Copy(p.velocity);
          frictionForce.normalize();
          frictionForce.multiply(-0.03);
          p.move(frictionForce);
        }
        
        /*if(mouseIsPressed)
        {
          let dx = (mouseX - width/2)/width;
          let dy = (mouseY - height/2)/height;
          p.move(createVector(dx,dy));
        }*/
        p.update();
      }
    }
  }
  