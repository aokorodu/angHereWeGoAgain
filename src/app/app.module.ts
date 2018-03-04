import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';
import { OrbitsComponent } from './orbits/orbits.component';
import { TitleAnimComponent } from './title-anim/title-anim.component';
import { SparksComponent } from './sparks/sparks.component';


@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    OrbitsComponent,
    TitleAnimComponent,
    SparksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
