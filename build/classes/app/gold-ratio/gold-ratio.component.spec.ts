import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldRatioComponent } from './gold-ratio.component';

describe('GoldRatioComponent', () => {
  let component: GoldRatioComponent;
  let fixture: ComponentFixture<GoldRatioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoldRatioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
