import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';

import { AssetData } from '../asset-data'
import { Candlestick } from '../candlestick'
import { AssetDataService } from '../services/asset-data.service';
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

    static counter=0;
    static tableCounter=0;
    
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
    isShowExplanation=false;

  constructor(private assetsService: AssetsService, private assetDataService: AssetDataService,
              private route: ActivatedRoute, private location: Location) {}
    
    

    
  ngOnInit():void {
     
     this.route.paramMap        
    .switchMap((params: ParamMap) => this.assetsService.getAsset(params.get('symbol')))
    .subscribe(asset => {this.asset = asset;
                         this.asset.digitsAfterDecimalPoint==null ? this.asset.digitsAfterDecimalPoint=2 : this.asset.digitsAfterDecimalPoint; // Configure how many digits to show after the decimal point
                         this.isShowAssetData=false;
                         clearInterval(this.interval); 
                         this.assetSummaryOn();
        
                         this.getAssetData(this.asset);
                         this.interval=setInterval(()=>{this.getAssetData(this.asset)},2000000);
                        }
               );
      
      
  }
    
    
    
    getAssetData(asset:Asset):void{
       
        AssetSummaryComponent.counter++;    // for checking how much times this component was viewed...
        
        this.observableAssetData = this.assetDataService.getAssetData(asset);
        this.observableAssetData.subscribe(assetData => {this.assetData = assetData;
                                                         this.isShowAssetData=true;
                                                         this.getAssetHistoricData(asset)}) ;       
        
        }
    
    
    getAssetHistoricData(asset:Asset):void{
       
        this.observableCandlestick = this.assetDataService.getAssetHistoricData(asset);
        this.observableCandlestick.subscribe(candlesticks => {
            
            this.candlestick = candlesticks;
            this.MA50=this.calculateMovingAverage(50,this.candlestick);
            this.MA100=this.calculateMovingAverage(100,this.candlestick);
            this.MA200=this.calculateMovingAverage(200,this.candlestick);
            this.RSI=this.calculateRSI(14,this.candlestick);
            this.overallTrend=this.calculateOverallTrend(this.MA50,this.MA100,this.MA200,this.assetData.closeAsNumber);
            
            this.getAssetHistoricDataForWeeks(1,this.candlestick,this.assetData).then(candlesticks=>{   // one week.   
                
                this.oneWeekPerformance.return=this.calculateReturnForPeriod(candlesticks,this.assetData);
                this.oneWeekPerformance.low=this.findPeriodLow(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.oneWeekPerformance.high=this.findPeriodHigh(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.oneWeekPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                this.oneWeekPerformance.redWidth=100-this.oneWeekPerformance.greenWidth;
                this.oneWeekPerformance.lowReturn=this.calculatePeriodLowReturn(this.oneWeekPerformance.low,candlesticks);
                this.oneWeekPerformance.highReturn=this.calculatePeriodHighReturn(this.oneWeekPerformance.high,candlesticks);
            });
               
            this.getAssetHistoricDataForMonths(1,this.candlestick,this.assetData).then(candlesticks=>{    // one month
                
                this.oneMonthPerformance.return=this.calculateReturnForPeriod(candlesticks,this.assetData);
                this.oneMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.oneMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.oneMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                this.oneMonthPerformance.redWidth=100-this.oneMonthPerformance.greenWidth;
                this.oneMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.oneMonthPerformance.low,candlesticks);
                this.oneMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.oneMonthPerformance.high,candlesticks);
                
                });
            
            this.getAssetHistoricDataForMonths(3,this.candlestick,this.assetData).then(candlesticks=>{    // three months
            
                this.threeMonthPerformance.return=this.calculateReturnForPeriod(candlesticks,this.assetData);
                this.threeMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.threeMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.threeMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                this.threeMonthPerformance.redWidth=100-this.threeMonthPerformance.greenWidth;
                this.threeMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.threeMonthPerformance.low,candlesticks);
                this.threeMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.threeMonthPerformance.high,candlesticks);
                });
                
            this.getAssetHistoricDataForMonths(6,this.candlestick,this.assetData).then(candlesticks=>{    // six months
            
                this.sixMonthPerformance.return=this.calculateReturnForPeriod(candlesticks,this.assetData);
                this.sixMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.sixMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.sixMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                this.sixMonthPerformance.redWidth=100-this.sixMonthPerformance.greenWidth;
                this.sixMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.sixMonthPerformance.low,candlesticks);
                this.sixMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.sixMonthPerformance.high,candlesticks);
                });
            
            this.getAssetHistoricDataForMonths(9,this.candlestick,this.assetData).then(candlesticks=>{    // nine months
            
                this.nineMonthPerformance.return=this.calculateReturnForPeriod(candlesticks,this.assetData);
                this.nineMonthPerformance.low=this.findPeriodLow(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.nineMonthPerformance.high=this.findPeriodHigh(candlesticks,this.assetData).toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                this.nineMonthPerformance.greenWidth=this.calculateGreenWidth(candlesticks,this.assetData);
                this.nineMonthPerformance.redWidth=100-this.nineMonthPerformance.greenWidth;
                this.nineMonthPerformance.lowReturn=this.calculatePeriodLowReturn(this.nineMonthPerformance.low,candlesticks);
                this.nineMonthPerformance.highReturn=this.calculatePeriodHighReturn(this.nineMonthPerformance.high,candlesticks);
                });
            
            });                                                                     
        
        }
    
    
    
    
    
    getAssetHistoricDataForWeeks(numberOfWeeks:number, candlestickArr:Candlestick[], assetData:AssetData):Promise<Candlestick[]>{
        
        let date = new Date();
        let currentMonth=date.getMonth();  // January is 0, February is 1...
        let currentYear=date.getFullYear();
        let baseDay;
        let baseMonth;
        let baseYear=currentYear;
        let indexInArr:number;
        
        let daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
        
                
                baseDay=date.getDate()-7*numberOfWeeks;   // for a weekly check, the day of month should be equal to today minus 7
                
                if(baseDay>0){
                        baseMonth=currentMonth+1;
                }else{
                        baseDay=date.getDate()+daysInMonth[(currentMonth-1+12)%12]-7*numberOfWeeks;   // we need the number of days in last month.. number inside [] represent index...
                        baseMonth=currentMonth>0 ? currentMonth : 12; // need the number to represent a month and not index in array => January is 1
                        baseYear=baseMonth==12 ? baseYear-1 : baseYear; // if baseMonth==12 then we're in the first days of January and a week before would be last year  
                    }
            
                indexInArr=candlestickArr.length-numberOfWeeks*5;   // 5 trading days in a week, times the number of weeks...
                
            
        let indexToSliceArr=this.findTheRightDateIndexInArr(baseDay,baseMonth,baseYear,indexInArr,candlestickArr);
        let arrForPeriod=candlestickArr.slice(indexToSliceArr);
        
        return Promise.resolve(arrForPeriod);
        
        }
    
    
    
    
    
    getAssetHistoricDataForMonths(numberOfMonths:number, candlestickArr:Candlestick[], assetData:AssetData):Promise<Candlestick[]>{
        
        let date = new Date();
        let currentMonth=date.getMonth();  // January is 0, February is 1...
        let currentYear=date.getFullYear();
        let baseDay;
        let baseMonth=((currentMonth+1-numberOfMonths)+12)%12 > 0 ? ((currentMonth+1-numberOfMonths)+12)%12 : 12;
        let baseYear;       
        let indexInArr:number;
        
        if(currentMonth<=numberOfMonths){
            baseYear=currentYear-1;
        }else{
            baseYear=currentYear;
            }
            
        baseDay=date.getDate();                                 // for a monthly check, the day of month should be equal to today
        indexInArr=candlestickArr.length-numberOfMonths*21;   // 21 trading days in a month, times the number of months...
                
        let indexToSliceArr=this.findTheRightDateIndexInArr(baseDay,baseMonth,baseYear,indexInArr,candlestickArr);
        let arrForPeriod=candlestickArr.slice(indexToSliceArr);
        
        
        return Promise.resolve(arrForPeriod);
        
        }
    
    
    
    findTheRightDateIndexInArr(baseDay,baseMonth,baseYear,indexToStartSearchingFrom,candlestickArr):number{
        
        
        let indexInArr=indexToStartSearchingFrom;
        let alreadyWasBigger=false;
        let alreadyWasSmaller=false;
        let alreadyWasInRightMonth=false;
        let alreadyWasInRightYear=false;
        let foundStartingDate=false;
        
        
        while(!foundStartingDate){
        
            let dayOfTheMonth=candlestickArr[indexInArr].tradingDay.substring(8,10);
            let candleMonth=Number(candlestickArr[indexInArr].tradingDay.substring(5,7));
            let candleYear=candlestickArr[indexInArr].tradingDay.substring(0,4);
        
            
            if(candleYear==baseYear){
            
            
                    if(candleMonth==baseMonth){
                        
                        alreadyWasInRightMonth=true;
                        
                        if(dayOfTheMonth==baseDay){     // found the right date. calculate the return.
                                /*console.log("equal: "+candlestickArr[indexInArr].tradingDay);*/
                                return indexInArr;
                        }else if(dayOfTheMonth>baseDay){  // go back  a couple of days for the right date.
                                    /*console.log("bigger: "+candlestickArr[indexInArr].tradingDay);*/
                                
                                    if(alreadyWasSmaller){
                                                /*console.log("equal: "+candlestickArr[indexInArr-1].tradingDay);*/
                                                return indexInArr-1; 
                                    }else{
                                    
                                                 indexInArr--;
                                                 alreadyWasBigger=true;
                                        }
                            
                            }else{
                            
                                    if(alreadyWasBigger){
                                            /*console.log("equal: "+candlestickArr[indexInArr].tradingDay);*/
                                            return indexInArr; 
                                    }else{
                                            /*console.log("smaller: "+candlestickArr[indexInArr].tradingDay);*/
                                            indexInArr++;
                                            alreadyWasSmaller=true;
                                        }
                            
                             }
                    
                   
                        
                        }else if(candleMonth<baseMonth){
                                
                                if(alreadyWasInRightMonth){
                                            /*console.log("equal: "+candlestickArr[indexInArr].tradingDay);*/
                                            return indexInArr; 
                                    }else{
                                            /*console.log("month: go forward");*/
                                            indexInArr++;
                                    }
                         }else{
                        
                                if(alreadyWasInRightMonth){
                                            /*console.log("equal: "+candlestickArr[indexInArr-1].tradingDay);*/
                                            return indexInArr-1; 
                                    }else{
                                            /*console.log("month: keep going back");*/
                                            indexInArr--;
                                    }
                        
                        
                            }
                
                }else {                                  // go back to the year before. example: we need 11/16 but we're at 01/17.
                        
                        if(alreadyWasInRightYear){
                                /*console.log("equal: "+candlestickArr[indexInArr].tradingDay);*/
                                return indexInArr; 
                        }else{
                    
                                /*console.log("year: keep going back");*/
                                indexInArr--;
                            }
                }
            
        }
        
        
        
   }
    
    
    
    
    calculateReturnForPeriod(candlestickArr:Candlestick[], assetData:AssetData){
        /*console.log("close beginning: "+candlestickArr[0].tradingDay+" "+candlestickArr[0].close);*/
        let returnForPeriod= 100*((assetData.closeAsNumber/candlestickArr[0].close)-1);
        
        return returnForPeriod;
        
        }
        
    
    
    findPeriodLow(candlesticks:Candlestick[],assetData:AssetData){
        
        let candlesticksArr=candlesticks.slice();   // clone the candlesticks array so that changes of candlesticksArr won't affect it 
        candlesticksArr.sort(compareSessionLow);
        let periodLow = candlesticksArr[0].low;
        
        /* check if the today's low is lower then historical low. we need this check because candlesticks holds data up until today
         and assetData holds data of today. second condition is because on Saturday barchart give the open price of stocks as 0  */
        if(Number(assetData.low.toString().replace(/,/g,""))<periodLow && Number(assetData.low.toString().replace(/,/g,""))>0){    
            
            periodLow=Number(assetData.low.toString().replace(/,/g,""));    // get rid of the: , for 1000s...
            
            }
        
        return periodLow;        
        
        }
    
    
    findPeriodHigh(candlesticks:Candlestick[],assetData:AssetData){
        
        let candlesticksArr=candlesticks.slice();
        candlesticksArr.sort(compareSessionHigh);
        let periodHigh = candlesticksArr[0].high;
        
        if(Number(assetData.high.toString().replace(/,/g,""))>periodHigh){    // check if the today's high is higher then historical low. we need this check because candlesticks holds data up until today and assetData holds data of today
            
            periodHigh=Number(assetData.high.toString().replace(/,/g,""));    // get rid of the: , for 1000s...
            
            }
        
        return periodHigh;        
        
        }
    
    
    calculatePeriodLowReturn(periodLow,candlestickArr:Candlestick[]){

         periodLow=Number(periodLow.replace(/,/g,""));  // get rid of the: , for 1000s...
         let periodLowReturn = 100*((periodLow/candlestickArr[0].close)-1);
         let periodLowReturnAsString=periodLowReturn.toFixed(2)+"%";
         
        return  periodLowReturnAsString; 
            
        }
        
    calculatePeriodHighReturn(periodHigh,candlestickArr:Candlestick[]){
        
         periodHigh=Number(periodHigh.replace(/,/g,""));  // get rid of the: , for 1000s...   
         let periodHighReturn = 100*((periodHigh/candlestickArr[0].close)-1);
         let periodHighReturnAsString=periodHighReturn.toFixed(2)+"%";
         
         return  periodHighReturnAsString; 
            
            
        }
    
    
    calculateGreenWidth(candlesticks:Candlestick[],assetData:AssetData){
        
        let periodLow=this.findPeriodLow(candlesticks,assetData);
        let periodHigh=this.findPeriodHigh(candlesticks,assetData);
        let periodRange=periodHigh-periodLow;
        let greenWidthAsNumber = 100*(assetData.closeAsNumber - periodLow)/periodRange;
        let greenWidth = greenWidthAsNumber.toString()+"%";
        
        return greenWidthAsNumber;
        
        }
    
    
    
    calculateMovingAverage(duration:number, candlestickArr:Candlestick[]):string{
        
        let sum:number=0;
        
        for(let i=200-duration ; i<200 ; i++){
            
            sum += candlestickArr[i].close;
                
            }
        
        let movingAverage=sum/duration;
        
        return movingAverage.toFixed(this.asset.digitsAfterDecimalPoint).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        
        }
    
    
    calculateRSI(duration:number, candlestickArr:Candlestick[]):number{
        
        let sessionGainSum:number=0;
        let sessionLossSum:number=0;
        
        for(let i=200-duration ; i<200 ; i++){
            
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
        let RSI:number = 100-(100/(1+RS));
        
        
        return RSI;
        
        }
    
    
    
    calculateOverallTrend(ma50str:string,ma100str:string,ma200str:string,lastPrice:number){
        
        
        let ma50=Number(ma50str.replace(/,/g,""));
        let ma100=Number(ma100str.replace(/,/g,""));
        let ma200=Number(ma200str.replace(/,/g,""));
        /*console.log(ma50+" ; "+ma100+" : "+ma200);*/
        
        
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
        
            AssetSummaryComponent.tableCounter++;
        
    }
    
    assetSummaryOn():void{
        
            this.isShowAssetPerformance=false;
            this.isShowAssetTechnicals=false;
            this.isShowAssetSummary=true;
        
            AssetSummaryComponent.tableCounter++;
        
        }
    
        
    assetTechnicalsOn():void{
        
            this.isShowAssetSummary=false;
            this.isShowAssetPerformance=false;
            this.isShowAssetTechnicals=true;
        
            AssetSummaryComponent.tableCounter++;
        
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



