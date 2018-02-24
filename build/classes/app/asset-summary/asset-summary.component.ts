import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';

import { AssetData } from '../asset-data'
import { Candlestick } from '../candlestick';
import { AssetDataService } from '../services/asset-data.service';
import { HistoricalReturnService } from '../services/historical-return.service';
import { AssetPerformanceBarComponent } from '../asset-performance-bar/asset-performance-bar.component'
import { AssetPerformance } from '../asset-performance'

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap'; 

@Component({
  selector: 'asset-summary',
  templateUrl: './asset-summary.component.html',
  styleUrls: ['./asset-summary.component.css'],
  host: {
        '(document:click)': 'handleClick($event)',
    },
})
    
export class AssetSummaryComponent implements OnInit {

    
    asset: Asset;
    assetData: AssetData;
    candlestick: Candlestick[];
    observableAssetData: Observable<AssetData[]>;
    observableCandlestick: Observable<Candlestick[]>;
    interval;
    isShowAssetData:boolean;
    isShowAssetSummary:boolean=true;
    isShowAssetPerformance:boolean;
    isShowAssetTechnicals:boolean;
    isMinute;
    isDay;
    isWeek;
    isMonth;
    isRefreshPerformanceData=true;
    oneWeekPerformance:AssetPerformance={};
    oneMonthPerformance:AssetPerformance={};
    threeMonthPerformance:AssetPerformance={};
    sixMonthPerformance:AssetPerformance={};
    nineMonthPerformance:AssetPerformance={};
    MA50:string;
    MA100:string;
    MA200:string;
    RSI:number;
    overallTrend;
    isShowHistoricData=false;
    isShowExplanation=false;

  constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private historicalReturnService:HistoricalReturnService,  
              private route: ActivatedRoute, private location: Location) {}
    
    

    
  ngOnInit():void {
     
     this.route.paramMap        
    .switchMap((params: ParamMap) => this.assetsService.getAsset(params.get('symbol')))
    .subscribe(asset => {this.asset = asset;
                         this.asset.digitsAfterDecimalPoint==null ? this.asset.digitsAfterDecimalPoint=2 : this.asset.digitsAfterDecimalPoint; // Configure how many digits to show after the decimal point
                         this.isShowAssetData=false;
                         this.isShowHistoricData=false;
                         this.isRefreshPerformanceData=true;
                         this.resetTimeFrame();
                         /*clearInterval(this.interval);*/ 
                         this.assetSummaryOn();
        
                         this.getAssetData(this.asset);
                         /*this.interval=setInterval(()=>{this.getAssetData(this.asset)},2000000);*/
                        }
               );
      
      
  }
    
    
    
    getAssetData(asset:Asset):void{
       
        
        this.observableAssetData = this.assetDataService.getAssetData(asset);
        this.observableAssetData.subscribe(assetData => {this.assetData = assetData;
                                                         this.isShowAssetData=true;
                                                         this.getAssetHistoricData(asset,'daily',300)}) ;       
        
        }
    
    
    getAssetHistoricData(asset:Asset, timeFrame:string, maxRecords:number):void{
       
        this.observableCandlestick = this.assetDataService.getAssetHistoricData(asset,timeFrame,maxRecords);
        this.observableCandlestick.subscribe(candlesticks => {
            
            this.candlestick = candlesticks;
            this.MA50=this.calculateMovingAverage(50,this.candlestick);
            this.MA100=this.calculateMovingAverage(100,this.candlestick);
            this.MA200=this.calculateMovingAverage(200,this.candlestick);
            this.RSI=this.calculateRSI(14,this.candlestick);
            this.overallTrend=this.calculateOverallTrend(this.MA50,this.MA100,this.MA200,this.assetData.lastPriceAsNumber);
            
            if(this.isRefreshPerformanceData){
            
                this.historicalReturnService.getAssetHistoricDataForWeeks(1,this.candlestick).then(candlesticks=>{   // one week.   
                    
                    this.oneWeekPerformance.return=this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.assetData,this.asset);
                    this.oneWeekPerformance.low=this.findPeriodLow(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.oneWeekPerformance.high=this.findPeriodHigh(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.oneWeekPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                    this.oneWeekPerformance.redWidth=100-this.oneWeekPerformance.greenWidth;
                    this.oneWeekPerformance.lowReturn=this.calculatePeriodLowReturn(this.oneWeekPerformance.low,candlesticks);
                    this.oneWeekPerformance.highReturn=this.calculatePeriodHighReturn(this.oneWeekPerformance.high,candlesticks);
                });
                   
                this.historicalReturnService.getAssetHistoricDataForMonths(1,this.candlestick).then(candlesticks=>{    // one month
                    
                    this.oneMonthPerformance.return=this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.assetData,this.asset);
                    this.oneMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.oneMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.oneMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                    this.oneMonthPerformance.redWidth=100-this.oneMonthPerformance.greenWidth;
                    this.oneMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.oneMonthPerformance.low,candlesticks);
                    this.oneMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.oneMonthPerformance.high,candlesticks);
                    
                    });
                
                this.historicalReturnService.getAssetHistoricDataForMonths(3,this.candlestick).then(candlesticks=>{    // three months
                
                    this.threeMonthPerformance.return=this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.assetData,this.asset);
                    this.threeMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.threeMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.threeMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                    this.threeMonthPerformance.redWidth=100-this.threeMonthPerformance.greenWidth;
                    this.threeMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.threeMonthPerformance.low,candlesticks);
                    this.threeMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.threeMonthPerformance.high,candlesticks);
                    });
                    
                this.historicalReturnService.getAssetHistoricDataForMonths(6,this.candlestick).then(candlesticks=>{    // six months
                
                    this.sixMonthPerformance.return=this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.assetData,this.asset);
                    this.sixMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.sixMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.sixMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                    this.sixMonthPerformance.redWidth=100-this.sixMonthPerformance.greenWidth;
                    this.sixMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.sixMonthPerformance.low,candlesticks);
                    this.sixMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.sixMonthPerformance.high,candlesticks);
                    });
                
                this.historicalReturnService.getAssetHistoricDataForMonths(9,this.candlestick).then(candlesticks=>{    // nine months
                
                    this.nineMonthPerformance.return=this.historicalReturnService.calculateReturnForPeriod(candlesticks,this.assetData,this.asset);
                    this.nineMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.nineMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData,this.asset).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    this.nineMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                    this.nineMonthPerformance.redWidth=100-this.nineMonthPerformance.greenWidth;
                    this.nineMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.nineMonthPerformance.low,candlesticks);
                    this.nineMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.nineMonthPerformance.high,candlesticks);
                    });
                
            }
            
            this.isShowHistoricData=true;
            
         });                                                                     
        
      }
    
    
        
    
    
    findPeriodLow(candlesticks:Candlestick[],assetData:AssetData, asset:Asset){
        
        let candlesticksArr=candlesticks.slice();   // clone the candlesticks array so that changes of candlesticksArr won't affect it
        let basePrice=candlesticksArr[0].close;
        let multiplier;
        if(basePrice/assetData.lastPriceAsNumber<5){
            multiplier=1;
        }else if(basePrice/assetData.lastPriceAsNumber<50){
              multiplier=10;
         }else if(basePrice/assetData.lastPriceAsNumber<500){
               multiplier=100;
          }else if(basePrice/assetData.lastPriceAsNumber<5000){
              multiplier=1000;
           }else if(basePrice/assetData.lastPriceAsNumber<50000){
               multiplier=10000;
            }
            
        
        asset.type=="Currency" || asset.type=="Commodity" ? candlesticksArr.map(candlesticks=>{candlesticks.low>130 ? candlesticks.low/=multiplier: candlesticks.low }) : null;
        candlesticksArr.sort(compareSessionLow);
        let periodLow = candlesticksArr[0].low;
        
        /* check if the today's low is lower then historical low. we need this check because candlesticks holds data up until today
         and assetData holds data of today. second condition is because on Saturday barchart give the open price of stocks as 0  */
        if(Number(assetData.low.toString().replace(/,/g,""))<periodLow && Number(assetData.low.toString().replace(/,/g,""))>0){    
            
            periodLow=Number(assetData.low.toString().replace(/,/g,""));    // get rid of the: , for 1000s...
            
            }
        
        return periodLow;        
        
        }
    
    
    findPeriodHigh(candlesticks:Candlestick[],assetData:AssetData, asset:Asset){
        
        let candlesticksArr=candlesticks.slice();
        let basePrice=candlesticksArr[0].close;
        let multiplier;
        if(basePrice/assetData.lastPriceAsNumber<5){
            multiplier=1;
        }else if(basePrice/assetData.lastPriceAsNumber<50){
              multiplier=10;
         }else if(basePrice/assetData.lastPriceAsNumber<500){
               multiplier=100;
          }else if(basePrice/assetData.lastPriceAsNumber<5000){
              multiplier=1000;
           }else if(basePrice/assetData.lastPriceAsNumber<50000){
               multiplier=10000;
            }
        asset.type=="Currency" || asset.type=="Commodity" ? candlesticksArr.map(candlesticks=>{candlesticks.high>130 ? candlesticks.high/=multiplier: candlesticks.high }) : null;
        candlesticksArr.sort(compareSessionHigh);
        let periodHigh = candlesticksArr[0].high;
        
        if(Number(assetData.high.toString().replace(/,/g,""))>periodHigh){    // check if the today's high is higher then historical low. we need this check because candlesticks holds data up until today and assetData holds data of today
            
            periodHigh=Number(assetData.high.toString().replace(/,/g,""));    // get rid of the: , for 1000s...
            
            }
        
        return periodHigh;        
        
        }
    
    
    calculatePeriodLowReturn(periodLow,candlestickArr:Candlestick[]){

        let basePrice=candlestickArr[0].close; 
        periodLow=Number(periodLow.replace(/,/g,""));  // get rid of the: , for 1000s...
        let multiplier;
        if(basePrice/periodLow<5){
            multiplier=1;
        }else if(basePrice/periodLow<50){
              multiplier=10;                // TO FIX THE BULLSHIT OF BARCHART!!!!!!!!!!!!!!!!!!!!!!!!!
         }else if(basePrice/periodLow<500){
               multiplier=100;
          }else if(basePrice/periodLow<5000){
              multiplier=1000;
           }else if(basePrice/periodLow<50000){
               multiplier=10000;
            }
        this.asset.type=="Currency" || this.asset.type=="Commodity" ?  basePrice>130 ? basePrice/=multiplier : basePrice : null;
        let periodLowReturn = 100*((periodLow/basePrice)-1);
        let periodLowReturnAsString=periodLowReturn.toFixed(2)+"%";
         
        return  periodLowReturnAsString; 
            
        }
        
    calculatePeriodHighReturn(periodHigh,candlestickArr:Candlestick[]){
        
         let basePrice=candlestickArr[0].close; 
         periodHigh=Number(periodHigh.replace(/,/g,""));  // get rid of the: , for 1000s...   
        let multiplier;
        if(basePrice/periodHigh<5){
            multiplier=1;
        }else if(basePrice/periodHigh<50){
              multiplier=10;                // TO FIX THE BULLSHIT OF BARCHART!!!!!!!!!!!!!!!!!!!!!!!!!
         }else if(basePrice/periodHigh<500){
               multiplier=100;
          }else if(basePrice/periodHigh<5000){
              multiplier=1000;
           }else if(basePrice/periodHigh<50000){
               multiplier=10000;
            }
         this.asset.type=="Currency" || this.asset.type=="Commodity" ?  basePrice>130 ? basePrice/=multiplier : basePrice : null;
         let periodHighReturn = 100*((periodHigh/basePrice)-1);
         let periodHighReturnAsString=periodHighReturn.toFixed(2)+"%";
         
         return  periodHighReturnAsString; 
            
            
        }
    
    
    calculateGreenWidth(candlesticks:Candlestick[],assetData:AssetData){
        
        let periodLow=this.findPeriodLow(candlesticks,assetData,this.asset);
        let periodHigh=this.findPeriodHigh(candlesticks,assetData,this.asset);
        let periodRange=periodHigh-periodLow;
        let greenWidthAsNumber = 100*(assetData.lastPriceAsNumber - periodLow)/periodRange;
        let greenWidth = greenWidthAsNumber.toString()+"%";
        
        return greenWidthAsNumber;
        
        }
    
    
    
    switchTimeFrame(event){
        
        let timeFrame=event.target.innerHTML;
        let maxRecords=300;
    
        timeFrame=='Minute' ? (this.isMinute=true, timeFrame='minutes') : this.isMinute=false;
        timeFrame=='Day' ? (this.isDay=true, timeFrame='daily') : this.isDay=false;
        timeFrame=='Week' ? (this.isWeek=true, timeFrame='weekly',maxRecords=200) : this.isWeek=false;
        timeFrame=='Month' ? (this.isMonth=true, timeFrame='monthly', maxRecords=60) : this.isMonth=false;
        
        this.isRefreshPerformanceData=false;      // to skip all the performance calculations inside the getHistory method
        
        this.getAssetHistoricData(this.asset,timeFrame,maxRecords);
    }
    
    
    resetTimeFrame(){       // reset when user first visits the page or when he wants to see data of another asset..
     
        this.isDay=true;
        this.isMinute=false;
        this.isWeek=false;
        this.isMonth=false;
    }
    
    
    
    calculateMovingAverage(duration:number, candlestickArr:Candlestick[]):string{
        
        console.log(candlestickArr.length); // log to the console the amount of data available
        
        if(duration==undefined || candlestickArr==undefined || duration>candlestickArr.length) return 'N/A';
        
        let sum:number=0;
        let length=candlestickArr.length;
        
        for(let i=length-duration ; i<length ; i++){
            
            sum += candlestickArr[i].close;
                
            }
        
        let movingAverage=sum/duration;
        
        return movingAverage.toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        
        }
    
    
    
    calculateRSI(duration:number, candlestickArr:Candlestick[]):any{
        
        if(duration==undefined || candlestickArr==undefined || duration>candlestickArr.length) return 'N/A';
        
        let length=candlestickArr.length;
        let sessionGainSum:number=0;
        let sessionLossSum:number=0;
        
        for(let i=1 ; i<=duration ; i++){      // calculate first rsi.
            
            let sessionChange=candlestickArr[i].close-candlestickArr[i-1].close;

            if(sessionChange>0){
                    sessionGainSum += sessionChange;
                }else{
                    sessionLossSum += sessionChange;
                }

        }
        
            
        let averageGain:number = sessionGainSum/duration;
        let averageLoss:number = sessionLossSum/duration;
        let RS:number = averageGain/-averageLoss;
        let RSI:number = 100-(100/(1+RS));          // first RSI.
        
        
        for (let i = duration + 1; i < length; i++) {  // for smoothing
            
            let sessionChange = candlestickArr[i].close-candlestickArr[i-1].close;
            
            if (sessionChange > 0) {
                averageGain = (averageGain*(duration-1) + sessionChange)/duration;
                averageLoss = (averageLoss*(duration-1) + 0)/duration;
                
            } else {
                averageGain = (averageGain*(duration-1) + 0)/duration;
                averageLoss = (averageLoss*(duration-1) + sessionChange)/duration;
            }
            
            RS = (averageGain / -averageLoss);
            RSI = 100 - (100 / (1 + RS));
        }
        
        
            return RSI;
        
     }
    
    
    
    
    
    calculateOverallTrend(ma50str:string,ma100str:string,ma200str:string,lastPrice:number){
        
        
        let ma50=Number(ma50str.replace(/,/g,""));
        let ma100=Number(ma100str.replace(/,/g,""));
        let ma200=Number(ma200str.replace(/,/g,""));
        
        
        if(lastPrice>ma50 && lastPrice>ma100){
            
                if( ma50/ma100>1.02 && ma100/ma200>1.02){
                    
                        return "Super Bullish";    
                    
                    }else{
                    
                        return "Bullish";
                    
                    }
        
        }else if(lastPrice<ma50 && lastPrice<ma100){
            
                if( ma50/ma100<0.98 && ma100/ma200<0.98){
                    
                        return "Super Bearish";    
                    
                    }else{
                    
                        return "Bearish";
                    
                    }
            
            
         }else{
            
                        return "Sideways"
            
            }
        
        
        }
        
    
    
    
    assetPerformanceOn():void{
        
            this.isShowAssetSummary=false;
            this.isShowAssetTechnicals=false;
            this.isShowAssetPerformance=true;
    }
    
    assetSummaryOn():void{
        
            this.isShowAssetPerformance=false;
            this.isShowAssetTechnicals=false;
            this.isShowAssetSummary=true;
        }
    
        
    assetTechnicalsOn():void{
        
            this.isShowAssetSummary=false;
            this.isShowAssetPerformance=false;
            this.isShowAssetTechnicals=true;
        }

    
    
    getChangeColor() {
        if(this.assetData.netChange>0) {
          return "green";
        } else if(this.assetData.netChange<0) {
          return "red";
        } else {
          return "black";  
        }    
    }
    
    
    getRSIColor(){
      
        if(this.RSI>70){
            return 'red';   
        }else if(this.RSI<30){
            return 'green';   
        }else{
            return 'black';   
        }
        
    }
    
    
    getStyle(elementValue) {
        
        let value=elementValue.slice(0, - 1);
        
        if(Number(value)>0) {
          return "green";
        } else if(Number(value)<0) {
          return "red";
        } else {
          return "black";  
        } 
           
  }
    
    getAssetChangeSign():string{
       if(this.assetData.netChange>0){
           return "+";
           }
        
        return "";
        }
    
    convertTimeStamp():string{
        
        let year=this.assetData.startTime.substring(0,4);
        let month=this.assetData.startTime.substring(5,7);
        let day=this.assetData.startTime.substring(8,10);
        let time=this.assetData.startTime.substring(11,19);
        
        return day+"/"+month+"/"+year+"  "+time+" EDT";
        }
    
    convertExpirationDate():string{
        
        let year=this.assetData.expirationDate.substring(0,4);
        let month=this.assetData.expirationDate.substring(5,7);
        let day=this.assetData.expirationDate.substring(8,10);
        
        return day+"/"+month+"/"+year;
        }
    
    
    toggleExplanation():void{
       
        if(this.isShowExplanation){
                this.isShowExplanation=false;
            }else{
                this.isShowExplanation=true; 
                }
    } 
    
    
    
    closeExplanation(){
        if(this.isShowExplanation){
                this.isShowExplanation=false;
            }
    }
    
    
    
    handleClick(event){  
       let clickedComponent = event.target;
       let explanationRelatedClick = false;
       
       do {
           
           if (clickedComponent.id === "questionMarkButton" || clickedComponent.id === "explanationWindow") {
               explanationRelatedClick=true;
               return;
           }
           
           clickedComponent = clickedComponent.parentNode;
           
       } while (clickedComponent);
       
       if(!explanationRelatedClick){
           this.closeExplanation();
        }
      
   }
    
    

}


function compareSessionLow(a,b) {
      if (a.low > b.low)
        return 1;
      if (a.low < b.low)
        return -1;
        return 0;
    }


function compareSessionHigh(a,b) {
        if (a.high < b.high)
            return 1;
        if (a.high > b.high)
            return -1;
         return 0;
    
    }



