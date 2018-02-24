import { TestBed, inject } from '@angular/core/testing';

import { HistoricalReturnService } from './historical-return.service';

describe('HistoricalReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoricalReturnService]
    });
  });

  it('should be created', inject([HistoricalReturnService], (service: HistoricalReturnService) => {
    expect(service).toBeTruthy();
  }));
});
