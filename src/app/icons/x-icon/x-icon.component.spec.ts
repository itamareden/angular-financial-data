import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XIconComponent } from './x-icon.component';

describe('XIconComponent', () => {
  let component: XIconComponent;
  let fixture: ComponentFixture<XIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
