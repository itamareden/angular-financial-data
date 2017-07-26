import { Component, OnInit } from '@angular/core';
import { Candlestick } from '../Candlestick';
import { AssetDataService } from '../asset-data.service'

import { Observable } from 'rxjs';

@Component({
  selector: 'sentiment-barometer',
  templateUrl: './sentiment-barometer.component.html',
  styleUrls: ['./sentiment-barometer.component.css']
})
export class SentimentBarometerComponent implements OnInit {
        
    candlestick: Candlestick[];
    observableMarketData: Observable<Candlestick[]>;

  constructor(private assetDataService: AssetDataService) { }

  ngOnInit() {
      
      
        /*this.observableMarketData = this.assetDataService.getDataForBarometer();
        this.observableMarketData.subscribe(candlestick => {this.candlestick = candlestick;
                                                            console.log(candlestick)});  */     
        
        
      
  }

}
