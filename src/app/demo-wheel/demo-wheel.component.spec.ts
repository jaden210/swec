import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DemoWheelComponent } from './demo-wheel.component';

describe('DemoWheelComponent', () => {
  let component: DemoWheelComponent;
  let fixture: ComponentFixture<DemoWheelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoWheelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
