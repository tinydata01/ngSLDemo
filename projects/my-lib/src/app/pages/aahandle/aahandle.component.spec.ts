import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AahandleComponent } from './aahandle.component';

describe('AahandleComponent', () => {
  let component: AahandleComponent;
  let fixture: ComponentFixture<AahandleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AahandleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AahandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
