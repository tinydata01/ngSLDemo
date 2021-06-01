import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperNavComponent } from './stepper-nav.component';

describe('StepperNavComponent', () => {
  let component: StepperNavComponent;
  let fixture: ComponentFixture<StepperNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
