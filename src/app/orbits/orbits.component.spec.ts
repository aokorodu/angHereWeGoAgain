import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrbitsComponent } from './orbits.component';

describe('OrbitsComponent', () => {
  let component: OrbitsComponent;
  let fixture: ComponentFixture<OrbitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrbitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrbitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
