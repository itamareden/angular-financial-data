import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentBarometerComponent } from './sentiment-barometer.component';

describe('SentimentBarometerComponent', () => {
  let component: SentimentBarometerComponent;
  let fixture: ComponentFixture<SentimentBarometerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentimentBarometerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentBarometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
