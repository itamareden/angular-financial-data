import { Injectable } from '@angular/core';

@Injectable()
export class MarketSentimentService {

  constructor() { }
    
    calculateMarketRisk(){
        
    return 24;    // for now. financial logic will be here
    
    }
    
    calculateMarketSentiment(){
        
    return 63;    // for now. financial logic will be here
    
    }

}
