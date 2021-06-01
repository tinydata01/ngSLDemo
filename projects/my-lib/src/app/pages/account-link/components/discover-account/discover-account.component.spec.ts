import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverAccountComponent } from './discover-account.component';

describe('DiscoverAccountComponent', () => {
  let component: DiscoverAccountComponent;
  let fixture: ComponentFixture<DiscoverAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
