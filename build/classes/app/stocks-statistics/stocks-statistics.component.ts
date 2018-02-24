import { Component, OnInit } from '@angular/core';
import { AssetDataService } from '../services/asset-data.service';
import { AssetInAssetsTable } from '../asset-in-assets-table'
import { TopAssetsPerformanceComponent } from '../top-assets-performance/top-assets-performance.component';

import { Observable } from 'rxjs';

@Component({
  selector: 'stocks-statistics',
  templateUrl: './stocks-statistics.component.html',
  styleUrls: ['./stocks-statistics.component.css']
})
export class StocksStatisticsComponent implements OnInit {
        
    assetsForPerformance = [{name:"S&P", symbol:"SPY", netPercChng:null, color1:'#f9f189', color2:'#f7ec5b', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Nasdaq", symbol:"QQQ", netPercChng:null, color1:'#aff986', color2:'#96f762', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Trannies", symbol:"IYT", netPercChng:null, color1:'#8ff7c8', color2:'#66f4b4', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Bio", symbol:"XBI", netPercChng:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Banks", symbol:"XLF", netPercChng:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"FAANG", symbol:"FB", netPercChng:null, color1:'#c5c8f7', color2:'#5d65f7', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Bonds", symbol:"TLT", netPercChng:null, color1:'#e1abf4', color2:'#cf59f9', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"HYG", symbol:"HYG", netPercChng:null, color1:'#f9aaa7', color2:'#fc605a', left:null, top:null, width:null, height:null, returnTop:null},
                            ];
    
    totalBarsWidth=84;
    totalSpaceWidth=100-this.totalBarsWidth;   // space between bars
    totalChartHeight=450;   // in accordance with the height property of the chart-wrapper class in the css file
    topMargin=30;        // a small space from the top of the chart to the bars area..
    bottomMargin=30;
    totalBarsHeight=this.totalChartHeight-this.topMargin-this.bottomMargin-1;   // subtract 1 for the x axis, which its height is 1
    xAxisTop;
    
    observableAssetsTable: Observable<AssetInAssetsTable[]>;
    advancers : number = 0;
    decliners : number = 0;
    unchanged : number = 0;
    averagePercChng : number = 0;
    breadth="";
    isShowStatistics=false;
    isShowTable=false; 
    isShowComponent=false;
    obtainedAssetsData=false;

  constructor( private assetDataService: AssetDataService) { }

  ngOnInit() {
      
      this.createPerformanceChart();
      this.createStatistics();
     
  }
    
    createStatistics(){
       
       let classScope=this; 
       let interval=setInterval(function(){
          if(TopAssetsPerformanceComponent.assetsData.length>0){
              clearInterval(interval);
              classScope.calculateStatistics();
          }
         },200);  
        
    }
    
    
    createPerformanceChart(){
        
        this.getAssetsData();
        
        let classScope=this; 
        let interval=setInterval(function(){
              if(classScope.obtainedAssetsData){
                  clearInterval(interval);
                  classScope.calculateAssetBarProportions(classScope.assetsForPerformance);
              }
             },200);
        
    }
    
    
    getAssetsData(){
        
        let symbolsURL="";
        let indexOfFAANG=null;
        let faangSymbols="FB,AAPL,AMZN,NFLX,GOOG";
        
        for(let i=0; i<this.assetsForPerformance.length; i++){
            // concatenate symbols if not FAANG. FAANG is concatenated last for simplicity...
            this.assetsForPerformance[i].name!="FAANG" ? symbolsURL+=this.assetsForPerformance[i].symbol+"," : indexOfFAANG=i;
        }
        
        symbolsURL+=faangSymbols;
        
        this.observableAssetsTable = this.assetDataService.getMultipleAssetsData(symbolsURL);
        this.observableAssetsTable.subscribe(assetsData => {
        
            let onlyFaang=assetsData.splice(assetsData.length-5,5); // get only FAANG net percent change.
            let faangNetPercChng=0;
                
            for(let i=0; i<onlyFaang.length; i++){
                faangNetPercChng+=onlyFaang[i].netChangePercent;
            }
                
            faangNetPercChng/=5;    // FAANG is comprised of 5 stocks...
            this.assetsForPerformance[indexOfFAANG].netPercChng=faangNetPercChng;
                
            let j=0;
                    
            for(let i=0; i<assetsData.length; i++){
                // if it's FAANG, move on to next element in the assetsForPerformance
                i==indexOfFAANG ? j++ : null;
                this.assetsForPerformance[j].netPercChng=assetsData[i].netChangePercent;
                j++;
            }
            
            this.obtainedAssetsData=true;
        });
        
    }
    
    
    calculateAssetBarProportions(assets:any[]){
        
        
        let performanceDiff=this.calculateBestWorstDiff(assets);
        this.xAxisTop=this.calculateXAxisTop(assets);
        let barWidth=this.totalBarsWidth/assets.length;
        let spaceBetweenBars=this.totalSpaceWidth/(assets.length+1);    // space in %
        let lastBarLeft=0;
        
        for(let i=0; i<assets.length; i++){
            
            // calculate width and left , regardless if net change is positive or negative
            assets[i].width=barWidth; 
            i==0 ? assets[i].left=spaceBetweenBars : assets[i].left=lastBarLeft+barWidth+spaceBetweenBars;
            lastBarLeft=assets[i].left;
            
            if(assets[i].netPercChng>=0){       // >=...
               assets[i].height=(assets[i].netPercChng/performanceDiff)*this.totalBarsHeight;  // height
               assets[i].top=this.xAxisTop-assets[i].height;                                   // top
               assets[i].returnTop=assets[i].top-20;                                           // return top
            }else{
               assets[i].height=(-assets[i].netPercChng/performanceDiff)*this.totalBarsHeight;  // height
               assets[i].top=this.xAxisTop+1;                                                   // top
               assets[i].returnTop=assets[i].top+assets[i].height+5;                           // return top
            }
        }
        
        
        this.isShowTable=true;
        this.isShowComponent=true;  
       
        
    }
    
    calculateBestWorstDiff(assets:any[]):number{
        
        let bestAssetPercChng=-1000;     // extremely low
        let worstAssetPercChng=1000;          // extremely high
        let performanceDiff;
        
        for(let i=0; i<assets.length; i++){
            
            if(assets[i].netPercChng>bestAssetPercChng){
                bestAssetPercChng=assets[i].netPercChng;
             }else if(assets[i].netPercChng<worstAssetPercChng){
                 worstAssetPercChng=assets[i].netPercChng;
              }
        }
        
        if(bestAssetPercChng<0){
            performanceDiff=-worstAssetPercChng;    // both negative
         }else if(worstAssetPercChng>0){
             performanceDiff=bestAssetPercChng;     // both positive
          }else{
              performanceDiff=bestAssetPercChng-worstAssetPercChng;     // best positive worst negative
           }
           
        return performanceDiff;
        
    }
    
    calculateXAxisTop(assets:any[]):number{
        
        let bestAssetPercChng=-1000;     // extremely low
        let worstAssetPercChng=1000;          // extremely high
        let xAxisTop;
        
        for(let i=0; i<assets.length; i++){
            
            if(assets[i].netPercChng>bestAssetPercChng){
                bestAssetPercChng=assets[i].netPercChng;
             }else if(assets[i].netPercChng<worstAssetPercChng){
                 worstAssetPercChng=assets[i].netPercChng;
              }
        }
        
        if(bestAssetPercChng<0){
            xAxisTop=this.bottomMargin;    // both negative
         }else if(worstAssetPercChng>0){
             xAxisTop=this.bottomMargin+this.totalBarsHeight;     // both positive
          }else{
              xAxisTop=this.topMargin+bestAssetPercChng/(bestAssetPercChng-worstAssetPercChng)*this.totalBarsHeight;     // best positive worst negative
           }
        
        return xAxisTop;
        
    }
    
    
    calculateStatistics(){
        
        let stocksArr=TopAssetsPerformanceComponent.assetsData.slice();
        stocksArr.sort(comparePercChng); 
        let trimmedArrForAvgCalculation=stocksArr.slice(4,stocksArr.length-4);
        
        for(let i=0; i<stocksArr.length; i++){
            
            if(i<trimmedArrForAvgCalculation.length){   // because stocksArr length is greater..
                this.averagePercChng+=trimmedArrForAvgCalculation[i].netChangePercent;  // for average we use trimmed..
            }
            
            if(stocksArr[i].netChangePercent>0){    // for advancers we use all stocks
                this.advancers++;
             }else if(stocksArr[i].netChangePercent<0){
                 this.decliners++;
              }else{
                  this.unchanged++;
               }
        }
        
            this.advancers=100*this.advancers/stocksArr.length;
            this.decliners=100*this.decliners/stocksArr.length;
            this.unchanged=100*this.unchanged/stocksArr.length;
            this.averagePercChng/=trimmedArrForAvgCalculation.length;
        
            let classScope=this; 
            let interval=setInterval(function(){
                // proceed only after the last item in the array has netPercChng 
                  if(classScope.assetsForPerformance[classScope.assetsForPerformance.length-1].netPercChng!=null){
                      clearInterval(interval);
                      classScope.calculateBreadth();
                  }
                 },200); 
        
            this.isShowStatistics=true;
            this.isShowComponent=true;
        
    }
    
    calculateBreadth(){
        
        if(this.assetsForPerformance[0].netPercChng<0 && this.assetsForPerformance[0].netPercChng<this.averagePercChng && this.advancers>this.decliners){
                this.breadth="Positive";
        }else if(this.assetsForPerformance[0].netPercChng>0 && this.assetsForPerformance[0].netPercChng>this.averagePercChng && this.advancers<this.decliners){
                 this.breadth="Negative";
         }else{
                this.breadth="Neutral";
          }
        
        
    }
    
    

}



function comparePercChng(a,b) {
      if (a.netChangePercent < b.netChangePercent)
        return 1;
      if (a.netChangePercent > b.netChangePercent)
        return -1;
      return 0;
    }





