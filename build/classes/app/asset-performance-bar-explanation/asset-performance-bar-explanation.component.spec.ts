import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPerformanceBarExplanationComponent } from './asset-performance-bar-explanation.component';

describe('AssetPerformanceBarExplanationComponent', () => {
  let component: AssetPerformanceBarExplanationComponent;
  let fixture: ComponentFixture<AssetPerformanceBarExplanationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPerformanceBarExplanationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPerformanceBarExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
