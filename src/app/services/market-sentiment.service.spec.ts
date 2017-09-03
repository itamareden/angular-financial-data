import { TestBed, inject } from '@angular/core/testing';

import { MarketSentimentService } from './market-sentiment.service';

describe('MarketSentimentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketSentimentService]
    });
  });

  it('should be created', inject([MarketSentimentService], (service: MarketSentimentService) => {
    expect(service).toBeTruthy();
  }));
});
