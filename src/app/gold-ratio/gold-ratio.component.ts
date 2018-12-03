import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { UtilsService } from '../services/utils.service';
import { HistoricalReturnService } from '../services/historical-return.service';
import { BarChartConfig } from '../classes/bar-chart-config';
import { ChartData } from '../classes/chart-data';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-gold-ratio',
  templateUrl: './gold-ratio.component.html',
  styleUrls: ['./gold-ratio.component.css']
})
export class GoldRatioComponent implements OnInit {

    goldRatioArr = [
                    new ChartData("Day", "", [], [""], ['#f7ec5b']),
                    new ChartData("Week", "", [], [""], ['#96f762']),
                    new ChartData("Month", "", [], [""], ['#66f4b4']),
                    new ChartData("3 Months", "", [], [""], ['#61e3f9']),
                    new ChartData("Year", "", [], [""], ['#0099cc']),
                    ];
    chartConfig = new BarChartConfig(90, 50, 50, true, false, 1.4);
    
    goldDataArr = [];
    silverDataArr = [];
    ratioDataArr = [];
    chartConfigGold={
        type:'Line Chart',
        totalBarsWidth:88, 
        totalChartHeight:null, 
        totalChartWidth:null,     
        topMargin:50,       
        bottomMargin:50,
        xAxisTop:null,
        DADP: 0,
        roundTarget: 0.1,    
        lowestIsZero: false,   
        svg: true,
        polylinePoints: '',
        gridLineActive: true,
    }
    chartConfigSilver={
        type:'Line Chart',
        totalBarsWidth:88, 
        totalChartHeight:null, 
        totalChartWidth:null,     
        topMargin:50,       
        bottomMargin:50,
        xAxisTop:null,
        DADP: 0,
        roundTarget: 0.1,    
        lowestIsZero: false,   
        svg: true,
        polylinePoints: '',
        gridLineActive: true,
    }
    chartConfigRatio={
        type:'Line Chart',
        totalBarsWidth:88, 
        totalChartHeight:null, 
        totalChartWidth:null,     
        topMargin:50,       
        bottomMargin:50,
        xAxisTop:null,
        DADP: 0,
        roundTarget: 0.1,    
        lowestIsZero: false,   
        svg: true,
        polylinePoints: '',
        gridLineActive: true,
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
    isShowLineChart = false;
    historicArr=[];
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private utils: UtilsService,
                private historicalReturnService:HistoricalReturnService) { }

  
    ngOnInit() {
      
      this.getGoldRatioData(this.symbolsURL).then(goldRatioObject => {
          this.assetDataService.getHistoricalDataForMultipleAssets(['^XAUUSD','^XAGUSD'],'daily').then(dataArr=>{
              this.setAssetDataArr(dataArr[0], this.goldDataArr);
              this.setAssetDataArr(dataArr[1], this.silverDataArr);
              this.isShowLineChart = true;
              
                let isDataClean = this.utils.adjustArraysBasedOnProp(dataArr[0], dataArr[1], 'tradingDay');
                if(isDataClean){
                    this.historicArr = this.utils.getSyntheticAssetHistoricData(dataArr[0], dataArr[1], 'divide');
                    this.setAssetDataArr(this.historicArr, this.ratioDataArr);
                    this.historicalReturnService.getAssetHistoricDataForWeeks(1,this.historicArr).then(candlesticks=>{   // one week.
                        this.goldRatioArr[1].dataArr.push(this.historicalReturnService.calculateReturnForPeriod(candlesticks,goldRatioObject.lastPrice,'close'));   
                    });
                    this.historicalReturnService.getAssetHistoricDataForMonths(1,this.historicArr).then(candlesticks=>{   // one month.
                        this.goldRatioArr[2].dataArr.push(this.historicalReturnService.calculateReturnForPeriod(candlesticks,goldRatioObject.lastPrice,'close'));
                    });
                    this.historicalReturnService.getAssetHistoricDataForMonths(3,this.historicArr).then(candlesticks=>{   // 3 months.
                        this.goldRatioArr[3].dataArr.push(this.historicalReturnService.calculateReturnForPeriod(candlesticks,goldRatioObject.lastPrice,'close'));
                    });
                    this.isShowChart = true;
                }
            });
      
      
      });  
      
    }
    
    setAssetDataArr(rawDataArr, assetDataArr){
        rawDataArr.forEach(function(item){
            let itemObj = {
                name: '',
                dataToShow: item.close
            }
            assetDataArr.push(itemObj);
        })
    }
    
    getGoldRatioData(symbolsInURL:string): Promise<any>{
    
        this.observable = this.assetDataService.getMultipleAssetsData(symbolsInURL,'gold-ratio',['twelveMnthPct']);
        this.observable.subscribe(assetsData => {
            
            this.metals = assetsData;
            
            this.goldRatio=this.utils.getSyntheticAssetData(this.metals[0],this.metals[1],'divide','^XAUUSD', 'Gold/Silver Ratio');
            this.goldRatioArr[0].dataArr.push(this.goldRatio.dayReturn);
            this.goldRatioArr[4].dataArr.push(this.goldRatio.yearReturn);
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
