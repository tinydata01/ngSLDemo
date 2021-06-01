import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverAccountsComponent } from './discover-accounts.component';

describe('DiscoverAccountsComponent', () => {
  let component: DiscoverAccountsComponent;
  let fixture: ComponentFixture<DiscoverAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
