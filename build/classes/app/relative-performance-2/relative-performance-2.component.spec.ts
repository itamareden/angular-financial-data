import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativePerformance2Component } from './relative-performance-2.component';

describe('RelativePerformance2Component', () => {
  let component: RelativePerformance2Component;
  let fixture: ComponentFixture<RelativePerformance2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativePerformance2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativePerformance2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
