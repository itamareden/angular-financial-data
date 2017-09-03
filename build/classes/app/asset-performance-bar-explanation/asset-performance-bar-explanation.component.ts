import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'asset-performance-bar-explanation',
  templateUrl: './asset-performance-bar-explanation.component.html',
  styleUrls: ['./asset-performance-bar-explanation.component.css']
})
export class AssetPerformanceBarExplanationComponent implements OnInit {

   @Input() isShowOpenPrice;
   @Input() isShowLastPrice;
   @Input() openPriceLeft;
   @Input() lastPriceLeft;
   @Input() positionInExplanationsArr;
    
   /* 2 dimensional array which contains the explanations for each component. 
      the first array is for assets-table and the second for asset-summary      */ 
   explanationsArr=[[`The lowest/highest price in the past day.`,
                   `Calculated as the percentage change from lowest/highest price to yesterday's closing price.`,
                   `Asset's open price at 5pm EDT.`,
                   `Asset's last price.`,
                   `The distance from the lowest price to the last price as a % of the daily range.`,
                   `The distance from the highest price to the last price as a % of the daily range.`],
       
                    [`The lowest/highest price for the period.`,
                   `Calculated as the percentage change from lowest/highest price to the price at the beginning of the period.`,
                   ``,
                   `Asset's last price.`,
                   `The distance from the lowest price to the last price as a % of the period's range.`,
                   `The distance from the highest price to the last price as a % of the period's range.`]
                    ];
    
    
    
  constructor() { }

  ngOnInit() {
  }

}
