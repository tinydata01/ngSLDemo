import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FIListComponent } from './fi-list.component';

describe('FIListComponent', () => {
  let component: FIListComponent;
  let fixture: ComponentFixture<FIListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FIListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FIListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
