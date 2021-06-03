import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiSmallCardComponent } from './fi-small-card.component';

describe('FiSmallCardComponent', () => {
  let component: FiSmallCardComponent;
  let fixture: ComponentFixture<FiSmallCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiSmallCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiSmallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
