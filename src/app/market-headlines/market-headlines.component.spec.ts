import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketHeadlinesComponent } from './market-headlines.component';

describe('MarketHeadlinesComponent', () => {
  let component: MarketHeadlinesComponent;
  let fixture: ComponentFixture<MarketHeadlinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketHeadlinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketHeadlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
