import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkingStepperComponent } from './linking-stepper.component';

describe('LinkingStepperComponent', () => {
  let component: LinkingStepperComponent;
  let fixture: ComponentFixture<LinkingStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkingStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
