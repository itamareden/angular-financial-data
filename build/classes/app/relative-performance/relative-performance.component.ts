import { Component, OnInit, ViewChildren, QueryList, HostListener } from '@angular/core';
import { SearchAssetComponent } from '../search-asset/search-asset.component';
import { AssetDataService } from '../services/asset-data.service';
import { Asset } from '../asset'
import { AssetData } from '../asset-data'
import { Candlestick } from '../candlestick'
import { HistoricalReturnService } from '../services/historical-return.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'relative-performance',
  templateUrl: './relative-performance.component.html',
  styleUrls: ['./relative-performance.component.css']
})
    
    

export class RelativePerformanceComponent implements OnInit {
     
    /*@ViewChild(SearchAssetComponent) input1:SearchAssetComponent;*/   /*if we only need 1 child (not 2)*/
    @ViewChildren(SearchAssetComponent) inputs: QueryList<SearchAssetComponent>
    firstAsset = {  assetDetails:null,
                    lastPrice:0,
                    historicCandles:[],
                    return:0,
                    dayReturn:0,   
                    weekReturn:0,
                    monthReturn:0,
                    threeMonthReturn:0,
                    yearReturn:0,
                    barTop:0,
                    barHeight:0,
                    returnTop:0
                  }
    
    secondAsset = { assetDetails:null,
                    lastPrice:0,
                    historicCandles:[],
                    return:0,
                    dayReturn:0,   
                    weekReturn:0,
                    monthReturn:0,
                    threeMonthReturn:0,
                    yearReturn:0,
                    barTop:0,
                    barHeight:0,
                    returnTop:0
                  }
    relativePerformance;
    observable: Observable<any[]>;
    observableCandlesticks: Observable<Candlestick[]>;    
    
    isShowResults=false;
    xAxisTop;
    totalBarHeight=200;
    marginTop=20;   // the distance in pixel from the beginning of the frame to the asset with highest positive return
    isDay=true;
    isWeek=false;
    isMonth=false;
    isThreeMonth=false;
    isYear=false;
    durationFlagArr=[true,false,false,false,false];
    isError=true;
    finishidQuotesAJAX=false;   // for the getQuotes API
    finishedHistoryAJAX=false;   //________________________________ CHANGE TO FALSE!
    historyAJAXCounter:number=0;

    constructor(private assetDataService: AssetDataService, private historicalReturnService:HistoricalReturnService) { }

    ngOnInit() {
          
    }
    
    calculateAndDisplay(){
        
        this.isShowResults=false;
        
        this.firstAsset.assetDetails=this.inputs.first.selectedAsset;
        this.secondAsset.assetDetails=this.inputs.last.selectedAsset;
        
        let mainClass=this;
        
        this.getAssetsQuotes(this.firstAsset,this.secondAsset);
        this.getAssetHistoricData(this.firstAsset);
        this.getAssetHistoricData(this.secondAsset);
        
        let HistoryInterval=setInterval(function(){
            if(mainClass.historyAJAXCounter==2 && mainClass.finishidQuotesAJAX){
                
                mainClass.historicalReturnService.getAssetHistoricDataForWeeks(1,mainClass.firstAsset.historicCandles).then(candlesticks=>{      
                    mainClass.firstAsset.weekReturn=mainClass.historicalReturnService.calculateReturnForPeriod(candlesticks,mainClass.firstAsset.lastPrice);
                });
                
                mainClass.historicalReturnService.getAssetHistoricDataForWeeks(1,mainClass.secondAsset.historicCandles).then(candlesticks=>{      
                    mainClass.secondAsset.weekReturn=mainClass.historicalReturnService.calculateReturnForPeriod(candlesticks,mainClass.secondAsset.lastPrice);
                });
                
                mainClass.historicalReturnService.getAssetHistoricDataForMonths(1,mainClass.firstAsset.historicCandles).then(candlesticks=>{      
                    mainClass.firstAsset.monthReturn=mainClass.historicalReturnService.calculateReturnForPeriod(candlesticks,mainClass.firstAsset.lastPrice);
                });
                
                mainClass.historicalReturnService.getAssetHistoricDataForMonths(1,mainClass.secondAsset.historicCandles).then(candlesticks=>{      
                    mainClass.secondAsset.monthReturn=mainClass.historicalReturnService.calculateReturnForPeriod(candlesticks,mainClass.secondAsset.lastPrice);
                });
                
                mainClass.historicalReturnService.getAssetHistoricDataForMonths(3,mainClass.firstAsset.historicCandles).then(candlesticks=>{      
                    mainClass.firstAsset.threeMonthReturn=mainClass.historicalReturnService.calculateReturnForPeriod(candlesticks,mainClass.firstAsset.lastPrice);
                });
                
                mainClass.historicalReturnService.getAssetHistoricDataForMonths(3,mainClass.secondAsset.historicCandles).then(candlesticks=>{      
                    mainClass.secondAsset.threeMonthReturn=mainClass.historicalReturnService.calculateReturnForPeriod(candlesticks,mainClass.secondAsset.lastPrice);
                        mainClass.finishedHistoryAJAX=true;
                });
                
                mainClass.historyAJAXCounter=0;
                clearInterval(HistoryInterval);
                
            }
                                
        },200)
        

        
        let interval=setInterval(function(){
            if(mainClass.finishidQuotesAJAX==true && mainClass.finishedHistoryAJAX==true){
                mainClass.disableOtherDurationButtons(0);        // initialize to show the day results first, for checking another pair
                mainClass.displayForDuration(mainClass.firstAsset.dayReturn,mainClass.secondAsset.dayReturn);
                mainClass.finishidQuotesAJAX=false;
                mainClass.finishedHistoryAJAX=false;
                this.historyAJAXCounter=0;
                clearInterval(interval);
                
            }
                                
        },200)
        
    }
    
  
    displayRelativePerformance(duration){
         
        if(duration=='day'){
            this.displayForDuration(this.firstAsset.dayReturn,this.secondAsset.dayReturn);
            this.disableOtherDurationButtons(0);
        }else if(duration=='week'){
             this.displayForDuration(this.firstAsset.weekReturn,this.secondAsset.weekReturn);
             this.disableOtherDurationButtons(1);
         }else if(duration=='month'){
              this.displayForDuration(this.firstAsset.monthReturn,this.secondAsset.monthReturn);
              this.disableOtherDurationButtons(2);
          }else if(duration=='threeMonth'){
               this.displayForDuration(this.firstAsset.threeMonthReturn,this.secondAsset.threeMonthReturn);
               this.disableOtherDurationButtons(3);
           }else if(duration=='year'){
                this.displayForDuration(this.firstAsset.yearReturn,this.secondAsset.yearReturn);
                this.disableOtherDurationButtons(4);
           }
        
    }
    
    // use the getQuote API to get the last price, daily return and yearly return
    getAssetsQuotes(firstAsset, secondAsset ){
       
        let symbolsInURL=firstAsset.assetDetails.symbol+","+secondAsset.assetDetails.symbol;
        
        this.observable=this.assetDataService.getMultipleAssetsData(symbolsInURL,'relative-performance',['twelveMnthPct'])
        this.observable.subscribe(assetsData => {
                
                this.firstAsset.dayReturn=assetsData[0].dayReturn;
                this.firstAsset.yearReturn=assetsData[0].yearReturn;
                this.firstAsset.lastPrice=assetsData[0].lastPrice;
                // in case the user chooses the same asset, the length is 1....
                assetsData.length==1 ? this.secondAsset.dayReturn=this.firstAsset.dayReturn : this.secondAsset.dayReturn=assetsData[1].dayReturn;
                assetsData.length==1 ? this.secondAsset.yearReturn=this.firstAsset.yearReturn : this.secondAsset.yearReturn=assetsData[1].yearReturn;
                assetsData.length==1 ? this.secondAsset.lastPrice=this.firstAsset.lastPrice : this.secondAsset.lastPrice=assetsData[1].lastPrice;
            
                this.finishidQuotesAJAX=true; 
                console.log("finished quote AJAX");
            }); 
                
    }
    
    
    
    displayForDuration(firstAssetReturn:number, secondAssetReturn:number){
        
        this.firstAsset.assetDetails=this.inputs.first.selectedAsset;
        this.secondAsset.assetDetails=this.inputs.last.selectedAsset;

        this.firstAsset.return=firstAssetReturn;
        this.secondAsset.return=secondAssetReturn;
     
        this.relativePerformance=100*((1+firstAssetReturn/100)/(1+secondAssetReturn/100)-1);
        
        if(firstAssetReturn*secondAssetReturn>0){     // both positive or negative
        
            if(firstAssetReturn>0){        // both positive
            
                 this.xAxisTop=this.marginTop+this.totalBarHeight-1;
            
                 if(firstAssetReturn>=secondAssetReturn){  // positive first > positive second
                    
                     this.firstAsset.barTop=this.marginTop;
                     this.firstAsset.barHeight=this.totalBarHeight-1;
                     this.secondAsset.barHeight=(secondAssetReturn/firstAssetReturn)*(this.totalBarHeight-1);
                     this.secondAsset.barTop=this.marginTop+(this.firstAsset.barHeight-this.secondAsset.barHeight);
                     
                 }else{                                             // positive second > positive first
                     
                     this.secondAsset.barTop=this.marginTop;
                     this.secondAsset.barHeight=this.totalBarHeight-1;
                     this.firstAsset.barHeight=(firstAssetReturn/secondAssetReturn)*(this.totalBarHeight-1);
                     this.firstAsset.barTop=this.marginTop+(this.secondAsset.barHeight-this.firstAsset.barHeight);
                       
                  }
                
                this.firstAsset.returnTop=this.firstAsset.barTop-20;
                this.secondAsset.returnTop=this.secondAsset.barTop-20;
                
            }else{          // both negative
            
                 this.xAxisTop=this.marginTop;
                 this.firstAsset.barTop=this.xAxisTop+1;
                 this.secondAsset.barTop=this.xAxisTop+1;
            
                 if(firstAssetReturn<=secondAssetReturn){  // negative second > negative first   
                
                     this.firstAsset.barHeight=this.totalBarHeight-1;
                     this.secondAsset.barHeight=(secondAssetReturn/firstAssetReturn)*(this.totalBarHeight-1);
                     
                 }else{                                              // negative first > negative second
                 
                     this.secondAsset.barHeight=this.totalBarHeight-1;
                     this.firstAsset.barHeight=(firstAssetReturn/secondAssetReturn)*(this.totalBarHeight-1);
                     
                 }
                
                this.firstAsset.returnTop=this.firstAsset.barTop+this.firstAsset.barHeight+5;
                this.secondAsset.returnTop=this.secondAsset.barTop+this.secondAsset.barHeight+5;
             }
            
        }else if(firstAssetReturn*secondAssetReturn<0){
            
            let firstToTotalRatio=Math.abs(firstAssetReturn)/(Math.abs(firstAssetReturn)+Math.abs(secondAssetReturn));
            
            if(firstAssetReturn<0){      // first negative, second positive  =>  second > first
        
                this.secondAsset.barTop=this.marginTop;
                this.secondAsset.barHeight=(this.totalBarHeight-1)*(1-firstToTotalRatio);
                this.xAxisTop=this.secondAsset.barTop+this.secondAsset.barHeight;
                this.firstAsset.barTop=this.xAxisTop+1;
                this.firstAsset.barHeight=(this.totalBarHeight-1)*firstToTotalRatio;
                this.firstAsset.returnTop=this.firstAsset.barTop+this.firstAsset.barHeight+5;
                this.secondAsset.returnTop=this.secondAsset.barTop-20;
                
            
            }else{      // first positive, second negative  =>  first > second
                
                this.firstAsset.barTop=this.marginTop;
                this.firstAsset.barHeight=(this.totalBarHeight-1)*firstToTotalRatio;
                this.xAxisTop=this.firstAsset.barTop+this.firstAsset.barHeight;
                this.secondAsset.barTop=this.xAxisTop+1;
                this.secondAsset.barHeight=(this.totalBarHeight-1)*(1-firstToTotalRatio);
                this.firstAsset.returnTop=this.firstAsset.barTop-20;
                this.secondAsset.returnTop=this.secondAsset.barTop+this.secondAsset.barHeight+5;
                
            }
        }else if(firstAssetReturn!=0){      // second must be 0
        
                this.secondAsset.barHeight=0;
            
            
        }
        
        
        this.isShowResults=true;
           
    }
    
    
    
    getAssetHistoricData(asset){
        
        this.observableCandlesticks = this.assetDataService.getAssetHistoricData(asset.assetDetails,'daily',300);
        this.observableCandlesticks.subscribe(candlesticks => {
            
             asset.historicCandles= candlesticks;
            this.historyAJAXCounter++;
            console.log("finished getting historic data for asset");
            });
    }
    
    
    disableOtherDurationButtons(enabledDurationFlag):void{
        
       for(let i=0; i<this.durationFlagArr.length; i++){
            if(i!=enabledDurationFlag){
                this.durationFlagArr[i]=false;
            }else{
                this.durationFlagArr[i]=true;
            }
        }
        
    }
    
    
    @HostListener('keyup') onKeyUp() {
        
        this.onClick();
    }
    
    @HostListener('mousedown') onMouseDown() {
        this.onClick();
    }
    
    @HostListener('click') onClick() {
        
        let firstInputTyped=this.inputs!=undefined ? this.inputs.first.assetTyped: null;
        let secondInputTyped=this.inputs!=undefined ? this.inputs.last.assetTyped: null;
        
        let isFirstInputInvalid=this.inputs.first.assetsNames.indexOf(firstInputTyped) == -1
        let issecondInputInvalid=this.inputs.last.assetsNames.indexOf(secondInputTyped) == -1
        /*console.log(isFirstInputInvalid+" "+issecondInputInvalid)*/
         if(firstInputTyped==null || secondInputTyped==null ||  isFirstInputInvalid || issecondInputInvalid ){
            this.isError=true;
        }else{
            this.isError=false;
        }
    }
             
     
    
}

