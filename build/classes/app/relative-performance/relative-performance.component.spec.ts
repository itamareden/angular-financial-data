import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativePerformanceComponent } from './relative-performance.component';

describe('RelativePerformanceComponent', () => {
  let component: RelativePerformanceComponent;
  let fixture: ComponentFixture<RelativePerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelativePerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelativePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
