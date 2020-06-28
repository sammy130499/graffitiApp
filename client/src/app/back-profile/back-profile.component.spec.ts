import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackProfileComponent } from './back-profile.component';

describe('BackProfileComponent', () => {
  let component: BackProfileComponent;
  let fixture: ComponentFixture<BackProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
