import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleAnimComponent } from './title-anim.component';

describe('TitleAnimComponent', () => {
  let component: TitleAnimComponent;
  let fixture: ComponentFixture<TitleAnimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleAnimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleAnimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
