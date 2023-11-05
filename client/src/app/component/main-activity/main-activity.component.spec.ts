import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainActivityComponent } from './main-activity.component';

describe('MainActivityComponent', () => {
  let component: MainActivityComponent;
  let fixture: ComponentFixture<MainActivityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainActivityComponent]
    });
    fixture = TestBed.createComponent(MainActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
