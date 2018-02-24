import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IlsPerformanceComponent } from './ils-performance.component';

describe('IlsPerformanceComponent', () => {
  let component: IlsPerformanceComponent;
  let fixture: ComponentFixture<IlsPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IlsPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IlsPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
