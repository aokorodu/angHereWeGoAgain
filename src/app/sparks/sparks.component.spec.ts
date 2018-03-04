import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SparksComponent } from './sparks.component';

describe('SparksComponent', () => {
  let component: SparksComponent;
  let fixture: ComponentFixture<SparksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
