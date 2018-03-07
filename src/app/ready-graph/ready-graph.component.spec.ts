import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyGraphComponent } from './ready-graph.component';

describe('ReadyGraphComponent', () => {
  let component: ReadyGraphComponent;
  let fixture: ComponentFixture<ReadyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
