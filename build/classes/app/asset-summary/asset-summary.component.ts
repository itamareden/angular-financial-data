import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { Asset } from '../asset'
import { AssetsService } from '../assets.service'

import { AssetData } from '../asset-data'
import { Candlestick } from '../candlestick'
import { AssetDataService } from '../asset-data.service'

import { Observable } from 'rxjs';
import 'rxjs/add/operator/switchMap'; 

@Component({
  selector: 'asset-summary',
  templateUrl: './asset-summary.component.html',
  styleUrls: ['./asset-summary.component.css']
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
    oneWeekReturn:number;
    oneMonthReturn:number;
    threeMonthsReturn:number;
    sixMonthsReturn:number;
    MA50:string;
    MA100:string;
    MA200:string;
    RSI:number;

  constructor(private assetsService: AssetsService, private assetDataService: AssetDataService,private route: ActivatedRoute, private location: Location) { 
 
}
    
    

    
  ngOnInit():void {
      
     this.route.paramMap        
    .switchMap((params: ParamMap) => this.assetsService.getAsset(params.get('symbol')))
    .subscribe(asset => {this.asset = asset;
                         this.asset.digitsAfterDecimalPoint==null ? this.asset.digitsAfterDecimalPoint=2 : this.asset.digitsAfterDecimalPoint; // Configure how many digits to show after the decimal point
                         this.isShowAssetData=false;
                         clearInterval(this.interval); 
                         this.assetSummaryOn();
        
                         this.getAssetData(this.asset);
                         this.interval=setInterval(()=>{this.getAssetData(this.asset)},20000);
                        }
               );
      
      
  }
    
    
    
    getAssetData(asset:Asset):void{
       
        this.observableAssetData = this.assetDataService.getAssetData(asset);
        this.observableAssetData.subscribe(assetData => {this.assetData = assetData;
                                                         this.isShowAssetData=true;
                                                         this.getAssetHistoricData(asset)}) ;       
        
        }
    
    
    getAssetHistoricData(asset:Asset):void{
       
        this.observableCandlestick = this.assetDataService.getAssetHistoricData(asset);
        this.observableCandlestick.subscribe(Candlesticks => {this.candlestick = Candlesticks;
                                                              this.MA50=this.calculateMovingAverage(50,this.candlestick);
                                                              this.MA100=this.calculateMovingAverage(100,this.candlestick);
                                                              this.MA200=this.calculateMovingAverage(200,this.candlestick);
                                                              this.RSI=this.calculateRSI(14,this.candlestick);
                                                              this.oneWeekReturn=this.calculateReturnForPeriod(1,false,this.candlestick,this.assetData); // true indicates a monthly check..
                                                              this.oneMonthReturn=this.calculateReturnForPeriod(1,true,this.candlestick,this.assetData);
                                                              this.threeMonthsReturn=this.calculateReturnForPeriod(3,true,this.candlestick,this.assetData);
                                                              this.sixMonthsReturn=this.calculateReturnForPeriod(6,true,this.candlestick,this.assetData)});       
        
        }
    
    
    
    
    
    
    calculateReturnForPeriod(numberOfperiods:number,isMonth:boolean, candlestickArr:Candlestick[], assetData:AssetData):number{
        
        let date = new Date();
        let baseDay:number;     // The closing rate of the asset in this day is the base rate to check the return.  
        let indexInArr:number;
        
        if(isMonth){                                                     // set Variables for a monthly check.
         
                baseDay=date.getDate();                                 // for a monthly check, the day of month should be equal to today
                indexInArr=candlestickArr.length-numberOfperiods*22;   // 22 trading days in a month, times the number of months...
            
            }else{                                                      // set Variables for a weekly check.
        
                baseDay=date.getDate()-7;                              // for a weekly check, the day of month should be equal to today minus 7
                indexInArr=candlestickArr.length-numberOfperiods*5;   // 5 trading days in a week, times the number of weeks...
            
            }
        
        let returnForPeriod:number=null;
        
        while(returnForPeriod==null){
        
            if(candlestickArr[indexInArr].dayOfTheMonth==baseDay){     // found the right date. calculate the return.
                
                returnForPeriod= 100*((assetData.closeAsNumber/candlestickArr[indexInArr].close)-1);
            
            }else if(candlestickArr[indexInArr].dayOfTheMonth>baseDay){  // go back  a couple of days for the right date.
                                
                indexInArr--;
            
            }else if(candlestickArr[indexInArr].dayOfTheMonth<baseDay){
                
                while(returnForPeriod==null){
                    
                    if(candlestickArr[indexInArr].dayOfTheMonth<candlestickArr[indexInArr+1].dayOfTheMonth){  // for situations where the month is changing (if candlestickArr[indexInArr].dayOfTheMonth was 31th and candlestickArr[indexInArr+1].dayOfTheMonth is 1st..)
                        
                        indexInArr++;
                        
                        }else{
                           
                            returnForPeriod= 100*((assetData.closeAsNumber/candlestickArr[indexInArr].close)-1);
                            
                        }
                    
                    if(candlestickArr[indexInArr].dayOfTheMonth>baseDay){
                        
                            returnForPeriod= 100*((Number(assetData.closeAsNumber)/candlestickArr[indexInArr-1].close)-1);
                        
                        }
                    
                    }
            
            }
        
        }
        
        
        return returnForPeriod;
        
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
    
    

}


