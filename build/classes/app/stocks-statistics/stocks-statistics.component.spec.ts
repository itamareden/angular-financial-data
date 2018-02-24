import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksStatisticsComponent } from './stocks-statistics.component';

describe('StocksStatisticsComponent', () => {
  let component: StocksStatisticsComponent;
  let fixture: ComponentFixture<StocksStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
