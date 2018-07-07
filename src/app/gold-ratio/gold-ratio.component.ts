import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { UtilsService } from '../services/utils.service';
import { HistoricalReturnService } from '../services/historical-return.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-gold-ratio',
  templateUrl: './gold-ratio.component.html',
  styleUrls: ['./gold-ratio.component.css']
})
export class GoldRatioComponent implements OnInit {

    goldRatioArr = [{name:"Day", dataToShow:null, color1:'#f9f189', color2:'#f7ec5b', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"Week", dataToShow:null, color1:'#8ff7c8', color2:'#66f4b4', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"Month", dataToShow:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"3 Months", dataToShow:null, color1:'#c5c8f7', color2:'#5d65f7', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"Year", dataToShow:null, color1:'#f9aaa7', color2:'#fc605a', left:null, top:null, width:null, height:null, returnTop:null},
                    ];
    
    chartProperties={
        type:'Bar Chart',
        totalBarsWidth:90,    
        totalChartHeight:null,
        totalChartWidth:null,   
        topMargin:50,        
        bottomMargin:50,
        xAxisTop:null,
    }
    
    symbolsURL:string="^XAUUSD,^XAGUSD";
    observable: Observable<object[]>;
    observableHistorical: Observable<object[]>;
    metals=[];  // gold and silver
    goldRatio={
                dayReturn: 0,
                yearReturn: 0,
                lastPrice:0
              };
    isShowChart = false;
    historicArr=[];
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private utils: UtilsService,
                private historicalReturnService:HistoricalReturnService) { }

  
    ngOnInit() {
      
      this.getGoldRatioData(this.symbolsURL).then(goldRatioObject => {
          this.assetDataService.getHistoricalDataForMultipleAssets(['^XAUUSD','^XAGUSD']).then(dataArr=>{
                let isDataClean = this.utils.adjustArraysBasedOnProp(dataArr[0], dataArr[1], 'tradingDay');
                if(isDataClean){
                    this.historicArr = this.utils.getSyntheticAssetHistoricData(dataArr[0], dataArr[1], 'divide');
                    this.historicalReturnService.getAssetHistoricDataForWeeks(1,this.historicArr).then(candlesticks=>{   // one week.
                        this.goldRatioArr[1].dataToShow = this.historicalReturnService.calculateReturnForPeriod(candlesticks,goldRatioObject.lastPrice,'close');   
                    });
                    this.historicalReturnService.getAssetHistoricDataForMonths(1,this.historicArr).then(candlesticks=>{   // one month.
                        this.goldRatioArr[2].dataToShow = this.historicalReturnService.calculateReturnForPeriod(candlesticks,goldRatioObject.lastPrice,'close');
                    });
                    this.historicalReturnService.getAssetHistoricDataForMonths(3,this.historicArr).then(candlesticks=>{   // 3 months.
                        this.goldRatioArr[3].dataToShow = this.historicalReturnService.calculateReturnForPeriod(candlesticks,goldRatioObject.lastPrice,'close');
                    });
                    this.isShowChart = true;
                }
            });
      
      
      });  
      
    }
    
    
    
    getGoldRatioData(symbolsInURL:string): Promise<any>{
    
        this.observable = this.assetDataService.getMultipleAssetsData(symbolsInURL,'gold-ratio',['twelveMnthPct']);
        this.observable.subscribe(assetsData => {
            
            this.metals = assetsData;
            
            this.goldRatio=this.utils.getSyntheticAssetData(this.metals[0],this.metals[1],'divide','^XAUUSD', 'Gold/Silver Ratio');
            this.goldRatioArr[0].dataToShow = this.goldRatio.dayReturn;
            this.goldRatioArr[4].dataToShow = this.goldRatio.yearReturn;
        });
        let classScope=this;
        let promise = new Promise(function(resolve) {
             let interval = window.setInterval(function() {
                 if(classScope.goldRatio.lastPrice > 0){
                    clearInterval(interval);
                    resolve(classScope.goldRatio);
                 }
             },250);
        });
        
        return promise;
            
    }

}
