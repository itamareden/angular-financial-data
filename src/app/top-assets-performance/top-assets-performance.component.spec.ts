import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAssetsPerformanceComponent } from './top-assets-performance.component';

describe('TopAssetsPerformanceComponent', () => {
  let component: TopAssetsPerformanceComponent;
  let fixture: ComponentFixture<TopAssetsPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopAssetsPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAssetsPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
