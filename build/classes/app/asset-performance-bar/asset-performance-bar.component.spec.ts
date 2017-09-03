import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPerformanceBarComponent } from './asset-performance-bar.component';

describe('AssetPerformanceBarComponent', () => {
  let component: AssetPerformanceBarComponent;
  let fixture: ComponentFixture<AssetPerformanceBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPerformanceBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPerformanceBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
