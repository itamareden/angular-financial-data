import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { UtilsService } from '../services/utils.service';
import { HistoricalReturnService } from '../services/historical-return.service';
import { BarChartConfig } from '../classes/bar-chart-config';
import { ChartData } from '../classes/chart-data';
import { WindowService } from '../services/window.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'ils-performance',
  templateUrl: './ils-performance.component.html',
  styleUrls: ['./ils-performance.component.css']
})
export class IlsPerformanceComponent implements OnInit {

        
    regularChartData = [
                new ChartData("Day", "dayReturn", [], [""], ['#f7ec5b']),
                new ChartData("Week", "weekReturn", [], [""], ['#96f762']),
                new ChartData("Month", "monthReturn", [], [""], ['#66f4b4']),
                new ChartData("3 Months", "threeMonthReturn", [], [""], ['#61e3f9']),
                new ChartData("Year", "yearReturn", [], [""], ['#0099cc']),
                ];
    regularChartConfig = new BarChartConfig(90, 50, 50, true, false, 1.4);
    normalizedChartData = [
                new ChartData("Day", "dayReturn", [], ["Up", "Down"], ['#f7ec5b', '#96f762']),
                new ChartData("Week", "weekReturn", [], ["Up", "Down"], ['#f7ec5b', '#96f762']),
                new ChartData("Month", "monthReturn", [], ["Up", "Down"], ['#f7ec5b', '#96f762']),
                new ChartData("3 Months", "threeMonthReturn", [], ["Up", "Down"], ['#f7ec5b', '#96f762']),
                new ChartData("Year", "yearReturn", [], ["Up", "Down"], ['#f7ec5b', '#96f762']),
                ];
    normalizedChartProperties = new BarChartConfig(90, 50, 50, true, true, 1.4);
    
    symbolsArr=['^USDILS','^EURILS','^GBPILS','^JPYILS','^CHFILS','^AUDILS','^CADILS','^SEKILS','^ZARILS','^PLNILS','^USDMXN','^USDBRL','^USDTRY','^USDCNH','^USDKRW','^NZDUSD'];
    observable: Observable<object[]>;
    ilsPairs=[];
    durationsArr = ['Day','Week','Month','3 Months','Year'];
    durationReturnArr = ['dayReturn','weekReturn','monthReturn','threeMonthReturn','yearReturn'];
    activeDuration = 'Day';
    activeDurationReturn = 'dayReturn';
    finishedSimpleDataFunc = false;
    finishedHistoricDataFunc = false;
    isShowChart = false;
    isMobile = false;
    
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private utils: UtilsService,
                private historicalReturnService:HistoricalReturnService, private windowService: WindowService) { }

  
    ngOnInit() {
        setTimeout(function(){
            this.getILSSimpleData(this.symbolsArr);       // for each pair we get last price and daily and yearly performance
//            this.getILSHistoricData(this.symbolsArr);     // for each pair we get historic performance (weekly, monthly etc.)
            this.utils.doOnlyWhen(this.fillDataForCharts.bind(this),
                this.checkIfAllDataArrived.bind(this), 40, 800, function(){
                    console.log("Error: the data didn't arrive in full");
                }
            );
        }.bind(this), 1000);
        let windowWidth=this.windowService.getNativeWindow().innerWidth;
        if(windowWidth <= 400) this.isMobile = true;
    }
    
    
    getILSSimpleData(symbolsInURL): void {
    
        this.observable = this.assetDataService.getMultipleAssetsData(symbolsInURL,'ils-performance',['twelveMnthPct']);
        this.observable.subscribe(assetsData => {
            this.ilsPairs = assetsData;
            for(let i=10; i<this.ilsPairs.length; i++){
                let relationship= assetsData[i]['symbol'].indexOf('USD')==1 ? 'divide' : 'multiply';
                let assetName=assetsData[i]['symbol'].substring(1); // get rid of the '^' at the beginning of the symbol
                assetName = assetName.indexOf('USD')==0 ? assetName.substring(3) : assetName.substring(0,3);
                this.ilsPairs[i]=this.utils.getSyntheticAssetData(this.ilsPairs[0],this.ilsPairs[i],relationship,assetsData[i]['symbol'], assetName)    
            }
            this.ilsPairs.map(item=>{this.assetsService.getAsset(item.symbol).then(asset=>{
                //  the second condition makes sure that the synthetic assets won't be affected
                if(asset!=undefined && asset.nameToShow.indexOf('ILS')>-1){ 
                    item.name=asset.nameToShow.substring(0,3);     // convert the names to the names I set in assets.service
                }
            });
            this.finishedSimpleDataFunc = true;    
         });
      });
            
    }
    
    
    getILSHistoricData(symbolsArr){
        this.assetDataService.getHistoricalDataForMultipleAssets(symbolsArr).then(pairsArr => {
            this.utils.doOnlyWhen(function(){
                    this.calculateHistoricReturns(pairsArr);
                    this.finishedHistoricDataFunc = true;
                }.bind(this),
                function(){
                    return !!this.finishedSimpleDataFunc;
                }.bind(this), 
            6, 1000);
        });
    }
    
    
    calculateHistoricReturns(pairsArr:[any]){
        for(let i=0; i<pairsArr.length; i++){
                let ilsPairHistoricArr = pairsArr[i];
                if(i>9){
                    let relationship= this.ilsPairs[i]['symbol'].indexOf('USD')==1 ? 'divide' : 'multiply';
                    let isDataClean = this.utils.adjustArraysBasedOnProp(pairsArr[0], pairsArr[i], 'tradingDay');
                    if(isDataClean) ilsPairHistoricArr = this.utils.getSyntheticAssetHistoricData(pairsArr[0], pairsArr[i], relationship);
                    else continue;
                }
                this.historicalReturnService.getAssetHistoricDataForWeeks(1,ilsPairHistoricArr).then(candlesticks=>{   // one week.
                    this.ilsPairs[i].weekReturn = this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.ilsPairs[i].lastPrice, 'close');
                });
                this.historicalReturnService.getAssetHistoricDataForMonths(1,ilsPairHistoricArr).then(candlesticks=>{   // one month.
                    this.ilsPairs[i].monthReturn = this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.ilsPairs[i].lastPrice,'close');
                });
                this.historicalReturnService.getAssetHistoricDataForMonths(3,ilsPairHistoricArr).then(candlesticks=>{   // 3 months.
                    this.ilsPairs[i].threeMonthReturn = this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.ilsPairs[i].lastPrice,'close');
                });
        }
    }
    
    
    checkIfAllDataArrived(){
        return !!(this.finishedSimpleDataFunc /*&& this.finishedHistoricDataFunc*/);
    }
    
    
    fillDataForCharts(){
        this.adjustForNZD();
        this.calculateDataForRegularChart();
        this.calculateDataForNormalizedChart();
        this.isShowChart = true;
    }
    
    
    changeDuration(e){
        this.activeDuration = e.target.innerHTML;
        this.activeDurationReturn = this.durationReturnArr[this.durationsArr.indexOf(this.activeDuration)];
    }
    
    
    calculateAverageReturn(prop, dataArr){
        let sum=0;
        let average=0;
        for(let i=0; i<dataArr.length; i++){
            if(dataArr[i][prop]==undefined) continue;
            sum+=dataArr[i][prop];
        }
        average=sum/dataArr.length
        
        return average;
    }
    
    
    calculatePostiveRetrunRatio(period, dataArr){
        let positiveRatioCounter=0;
        let positiveRatio=0;
        for(let i=0; i<dataArr.length; i++){
            dataArr[i][period]>0 ? positiveRatioCounter++ : null;
        }
        positiveRatio=100*positiveRatioCounter/dataArr.length;
        
        return positiveRatio;
    }
    
    calculateDataForRegularChart(){
        for(let i=0; i<this.regularChartData.length; i++){
            this.regularChartData[i].dataArr.push(this.calculateAverageReturn(this.regularChartData[i]['symbol'],this.ilsPairs));
//            this.regularChartData[i].dataArr.push(1.25);
        }
    }
    
    calculateDataForNormalizedChart(){
        for(let i=0; i<this.normalizedChartData.length; i++){
            let positiveReturn = this.calculatePostiveRetrunRatio(this.regularChartData[i]['symbol'],this.ilsPairs);
            let negativeReturn = 100 - positiveReturn;
            this.normalizedChartData[i]['dataArr'].push(positiveReturn);
            this.normalizedChartData[i]['dataArr'].push(negativeReturn);    // maybe use splice!
        }
    }
    
    adjustForNZD(){
        this.ilsPairs.splice(6,0,this.ilsPairs[this.ilsPairs.length-1]);  // put the NZD after the AUD
        this.ilsPairs.pop();    // remove the NZD from the end of the array
    }

}
