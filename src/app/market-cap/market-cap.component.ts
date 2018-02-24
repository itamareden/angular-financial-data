import { Component, OnInit, HostListener } from '@angular/core';
import { AssetsService } from '../services/assets.service';
import { TopAssetsPerformanceComponent } from '../top-assets-performance/top-assets-performance.component';
import { WindowService } from '../services/window.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'market-cap',
  templateUrl: './market-cap.component.html',
  styleUrls: ['./market-cap.component.css']
})
export class MarketCapComponent implements OnInit {
        
    
    isSettings=false;
    isShowPositionChngV=false;
    isShowSortByPositionChngV=false;
    isShowSortByPercentChngV=false;
    isSortByChng=false;
    stocksData;
    isShowData=false;
    isShowAllList=false;
    indexOfClickedItem=-1;
    clickedDataItems=[];    // represents the stocks that their data was clicked on (to switch to a different view)
    clickedPositionItems=[];    // represents the stocks that their position was clicked on (to switch to a different view)
    isStatistics=false;
    totalMarketCap=0;
    top5Ratio=0;
    top10Ratio=0;
    expandOrCollapse='Expand';
    stockNameWidth=290;
    positionChngWidth=40;
    yearlyChngAvg=0;
    positiveYearlyPerformanceRatio=0;
    negativeYearlyPerformanceRatio=0;
    unchangedYearlyPerformanceRatio=0;
    dailyMarketCapChng=0;
    yearlyMarketCapChng=0;
    top5MarketCap=[];
    top10MarketCap=[];
    dailyPerformanceStat=[];
    yearlyPerformanceStat=[];
    recordHighData=[];
    recordLowData=[];
    twoPercFromRecordHighData=[];
    twoPercFromRecordLowData=[];
    fivePercFromRecordHighData=[];
    fivePercFromRecordLowData=[];
    tenPercFromRecordHighData=[];
    tenPercFromRecordLowData=[];
    isShowQualifiedStocksNames=[false, false, false, false];
    
    
  constructor(private assetsService: AssetsService, private windowService: WindowService, private utils: UtilsService) { }

  ngOnInit() {

      this.calculateMarketCap();
      
      let windowWidth=this.windowService.getNativeWindow().innerWidth;
      if(windowWidth<780){
          this.stockNameWidth=160;
          this.positionChngWidth=30;
      }
  }
    
    
    
    calculateMarketCap(){
       let index=0;
       let classScope=this; 
       let interval=setInterval(function(){
          if(TopAssetsPerformanceComponent.assetsData.length>0){
              clearInterval(interval);
              console.log(TopAssetsPerformanceComponent.assetsData.length); // to inform how many stocks we got back in the response
              
              classScope.stocksData=TopAssetsPerformanceComponent.assetsData;
              classScope.stocksData.sort(classScope.utils.compareAssetsBasedOnProp('marketCap'));
              classScope.stocksData.map(item=>{classScope.assetsService.getAsset(item.symbol).then(asset=>{
                    
                    item.name=asset.nameToShow;     // convert the names to the names I set in assets.service
                    item.position=index;    // to compare with yesterday's position or last year's position
                    index++;
                    
                    });
                });
              
              classScope.isShowData=true;
              classScope.calculateMarketCapStat();
              classScope.top5MarketCap=classScope.calculateTopMarketCapStat(5);
              classScope.top10MarketCap=classScope.calculateTopMarketCapStat(10);
              classScope.dailyPerformanceStat=classScope.calculatePerformanceStat('daily');
              classScope.yearlyPerformanceStat=classScope.calculatePerformanceStat('yearly');
              classScope.calculateAllDesiredRatios();   // calculate all the 52 week high and low ratios
              
              
              setTimeout(function(){        // we need to wait for the Promise (asynchronous) to resolve...
                  classScope.calculatePositionChng('last day'); 
                  classScope.calculatePositionChng('last year'); 
                  },500);
          }
         },200);  
        
    }
    
    
    
    calculateMarketCapStat(){
        
        let totalMarketCapPrev=0;   // the total market cap of all the companies as of the previous trading day.
        let totalMarketCapLastYear=0;   // as of the last year...
        
        for(let i=0; i<this.stocksData.length; i++){
            this.totalMarketCap+=this.stocksData[i].marketCap;
            totalMarketCapPrev+=this.stocksData[i].prevMarketCap;
            totalMarketCapLastYear+=this.stocksData[i].lastYearMarketCap;
        }
        
        this.dailyMarketCapChng=100*(this.totalMarketCap/totalMarketCapPrev-1);
        this.yearlyMarketCapChng=100*(this.totalMarketCap/totalMarketCapLastYear-1);
        this.totalMarketCap/=1000;
        
    }
    
    calculateTopMarketCapStat(topNumber){
        
        let totalMarketCap=0;   // used for all 3 loops.
        let MarketCapSum=0;
        let MarketCapPrevSum=0;
        let MarketCapLastYearSum=0;
        let stocksArr=this.stocksData.slice();
        stocksArr.sort(this.utils.compareAssetsBasedOnProp('marketCap'));
        
        for(let i=0; i<stocksArr.length; i++){
            if(i<topNumber){
                MarketCapSum+=stocksArr[i].marketCap;
            }
            totalMarketCap+=stocksArr[i].marketCap;
        }
        let ratio=100*MarketCapSum/totalMarketCap;
        
        stocksArr.sort(this.utils.compareAssetsBasedOnProp('prevMarketCap'));
        totalMarketCap=0;
        for(let i=0; i<stocksArr.length; i++){
            if(i<topNumber){
                MarketCapPrevSum+=stocksArr[i].prevMarketCap;
            }
            totalMarketCap+=stocksArr[i].prevMarketCap;
        }
        let prevRatio=100*MarketCapPrevSum/totalMarketCap;
        let dailyRatioChng= Math.abs(ratio-prevRatio) < 0.1 ? 0 : ratio-prevRatio;
        
        stocksArr.sort(this.utils.compareAssetsBasedOnProp('lastYearMarketCap'));
        totalMarketCap=0;
        for(let i=0; i<stocksArr.length; i++){
            if(i<topNumber){
                MarketCapLastYearSum+=stocksArr[i].lastYearMarketCap;
            }
            totalMarketCap+=stocksArr[i].lastYearMarketCap;
        }
        let lastYearRatio=100*MarketCapLastYearSum/totalMarketCap;
        let yearlyRatioChng=Math.abs(ratio-lastYearRatio) < 0.1 ? 0 : ratio-lastYearRatio;
        
        return [ratio, dailyRatioChng, yearlyRatioChng];        
        
    }
    
    
    calculatePerformanceStat(period){
        
        let prop = (period=='daily' ? 'netChangePercent' : (period=='yearly' ? 'twelveMnthPct' : null));
        
        let periodChngCounter=0; 
        let arrLength= this.stocksData.length;  
        let positiveChngCounter=0;
        let negativeChngCounter=0;
            
        for(let i=0; i<arrLength; i++){
            periodChngCounter+=this.stocksData[i][prop];    // for calculating average
            
            if(this.stocksData[i][prop]>0){ // for performance dispersion
                positiveChngCounter++; 
            }else if(this.stocksData[i][prop]<0){
                negativeChngCounter++;
            }
            
        }
        
        let averageChng=periodChngCounter/arrLength;
        let positiveRatio=100*positiveChngCounter/arrLength; 
        let negativeRatio=100*negativeChngCounter/arrLength;
        let unchangedRatio=100*(arrLength-positiveChngCounter-negativeChngCounter)/arrLength;
        
        return [positiveRatio, negativeRatio, unchangedRatio, averageChng];
        
    }
    
    
    
    calculatePositionChng(period){
        
        let change;
        
        if(period=='last day'){
            this.stocksData.sort(this.utils.compareAssetsBasedOnProp('prevMarketCap'));
            for(let i=0; i<this.stocksData.length; i++){
                change=i-this.stocksData[i].position;
                this.stocksData[i].dailyPositionChng = (change > 0 ? '+'+change : change);
            }
        }else if(period=='last year'){
            this.stocksData.sort(this.utils.compareAssetsBasedOnProp('lastYearMarketCap'));
            for(let i=0; i<this.stocksData.length; i++){
                change=i-this.stocksData[i].position;
                this.stocksData[i].yearlyPositionChng = (change > 0 ? '+'+change : change);
            }
        }
        
        
        if(this.isSortByChng){  // check if prior to marking V to see position change, the visitor marked V to sort by yearly change
            this.stocksData.sort(this.utils.compareAssetsBasedOnProp('twelveMnthPct')); // if so, sort again based on yearly change
        }else{
            this.stocksData.sort(this.utils.compareAssetsBasedOnProp('marketCap')); // else, sort again based on today's market cap
        }
        
    }
    
    
    toggleSettings(){
        if(this.isSettings){
            this.isSettings=false;   
        }else{
            this.isSettings=true;
        }   
    }
    
    
    togglePositionChng(){
        if(this.isShowPositionChngV){
            this.isShowPositionChngV=false;
            this.switchPositionViewForAllStocks('daily change'); 
            if(this.isShowSortByPositionChngV){ // if there is a V inside THIS check box than cancel it.
                this.toggleSortByPositionChng();
            }  
        }else{
            this.isShowPositionChngV=true;
        }   
    }
    
    
    showPositionChange(){
        
        this.togglePositionChng();
        
        if(this.isShowPositionChngV){
            this.stockNameWidth=(this.stockNameWidth-this.positionChngWidth);    // has to equal: stock name original width - position change width.
        }else{
            this.stockNameWidth=(this.stockNameWidth+this.positionChngWidth);
        }
        
    }
    
    
    toggleSortByPositionChng(){
        if(this.isShowSortByPositionChngV){
            this.toggleSort('market cap');          // back to default
            this.switchPositionViewForAllStocks('daily change');    // restore the position change to the default daily change
            this.isShowSortByPositionChngV=false;   
        }else{
            this.toggleSort('yearly position change');
            this.switchPositionViewForAllStocks('yearly change');   // position change to show the yearly change.
            this.isShowSortByPositionChngV=true;
            this.isShowSortByPercentChngV ? this.isShowSortByPercentChngV=false : null;  // if the "sort by yearly percent change" is on the disable it...
        }   
    }
    
    sortByYearlyPositionChng(){
    
        if(this.stocksData && this.stocksData.length>0 && this.stocksData[0].yearlyPositionChng!='undefined'){
            for(let i=0; i<this.stocksData.length; i++){
                if(this.stocksData[i].yearlyPositionChng.toString().indexOf('+')>-1){
                   this.stocksData[i].yearlyPositionChng=Number(this.stocksData[i].yearlyPositionChng.substring(1)); 
                }else{
                   this.stocksData[i].yearlyPositionChng=Number(this.stocksData[i].yearlyPositionChng); 
                }
            }

            this.stocksData.sort(this.utils.compareAssetsBasedOnProp('yearlyPositionChng'));
            
            for(let i=0; i<this.stocksData.length; i++){
                if(this.stocksData[i].yearlyPositionChng>0){
                   this.stocksData[i].yearlyPositionChng='+'+this.stocksData[i].yearlyPositionChng; 
                }
            }
       }
    }
    
    
    
    toggleSortByPercentChng(){
        
        if(this.isShowSortByPercentChngV){
            this.toggleSort('market cap');
            this.switchPositionViewForAllStocks('daily change');    // when user turn off the V, let's switch the position change view back to default
            this.isShowSortByPercentChngV=false; 
        }else{
            this.toggleSort('twelveMnthPct');
            this.isShowSortByPercentChngV=true;
            this.isShowSortByPositionChngV ? this.isShowSortByPositionChngV=false : null;  // if the "sort by yearly percent change" is on, then disable it...
        }
        
        
    }
    
    
    toggleSort(criteria){
        
        if(this.stocksData){
            if(criteria=='market cap'){
                this.stocksData.sort(this.utils.compareAssetsBasedOnProp('marketCap')) ;
                this.switchDataViewForAllStocks('market cap');
            }else if(criteria=='yearly position change'){
                this.sortByYearlyPositionChng();
            }else if(criteria=='twelveMnthPct'){
                this.stocksData.sort(this.utils.compareAssetsBasedOnProp('twelveMnthPct'));
                this.switchDataViewForAllStocks('yearly change')
            }
        }
    }
    
    switchDataViewForAllStocks(newView){
        
        this.clickedDataItems=[];   // erase
        
        if(newView=='market cap'){
             return; 
        }else if(newView=='daily change'){
             for(let i=0; i<this.stocksData.length; i++){
                 this.clickedDataItems[i]=i;
             }
         }else if(newView=='yearly change'){
             for(let i=0; i<this.stocksData.length; i++){
                 this.clickedDataItems[i]=200+i;
             }
         }
    }
    
    
    toggleStockDataView(i){
        
        if(this.clickedDataItems.indexOf(i)>-1){
            this.clickedDataItems[this.clickedDataItems.indexOf(i)]=200+i;       // from daily change to yearly change
        }else if(this.clickedDataItems.indexOf(200+i)>-1){
            let itemLocation=this.clickedDataItems.indexOf(200+i);
            this.clickedDataItems.splice(itemLocation,1);           // from yearly change back to default
        }else{
            this.clickedDataItems.push(i);      // from default to daily change   
        }

    }
    
    toggleStockPositionView(i){
        
        if(this.clickedPositionItems.indexOf(i)>-1){
            let itemLocation=this.clickedPositionItems.indexOf(i);
            this.clickedPositionItems.splice(itemLocation,1);       // from yearly change back to default (daily)
        }else{
            this.clickedPositionItems.push(i);      // from default (daily) to yearly position change   
        }
        
    }
    
    switchPositionViewForAllStocks(newView){
        
        this.clickedPositionItems=[];   // erase
        
        if(newView=='daily change'){
             return; 
        }else if(newView=='yearly change'){
             for(let i=0; i<this.stocksData.length; i++){
                 this.clickedPositionItems[i]=i;
             }
         }
    }
    
    
    calculateAllDesiredRatios(){
        
        this.recordHighData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'high', 0);
        this.recordLowData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'low', 0);
        this.twoPercFromRecordHighData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'high', 0.02);  
        this.twoPercFromRecordLowData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'low', 0.02);
        this.fivePercFromRecordHighData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'high', 0.05);
        this.fivePercFromRecordLowData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'low', 0.05);
        this.tenPercFromRecordHighData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'high', 0.1);
        this.tenPercFromRecordLowData=this.calculateRatioOfStocksPerformanceRelativeToYearlyRecord(this.stocksData, 'low', 0.1);
        
    }
    
    
    calculateRatioOfStocksPerformanceRelativeToYearlyRecord(stocksArr, recordIdentifier:string,distanceFromRecord:number){  // 52 week high or low
        
        if(stocksArr == 'undefined') return null;
        if(recordIdentifier == undefined || typeof recordIdentifier != 'string' || (recordIdentifier!='high' && recordIdentifier!='low')) recordIdentifier='high';
        if(distanceFromRecord == undefined || typeof distanceFromRecord != 'number') distanceFromRecord=0;
        
        let qualifiedCounter=0; // stocks that met the condition of the function (broke record or near record)
        let ratio=0; 
        let qualifiedNames=[];
                
        if(recordIdentifier == 'high'){
            for(let i=0; i<stocksArr.length; i++){
                if(stocksArr[i].dailyHigh >= (1-distanceFromRecord)*stocksArr[i].yearRecordHigh){
                    qualifiedCounter++;
                    qualifiedNames.push(stocksArr[i].symbol); // the symbol of the stock..
                }
            }
        }else{
            for(let i=0; i<stocksArr.length; i++){
                // because before market open the daily high and low of stocks are being reset, we should add the extra condition...
                if(stocksArr[i].dailyLow!=0 && stocksArr[i].dailyLow <= (1+distanceFromRecord)*stocksArr[i].yearRecordLow){
                    qualifiedCounter++;
                    qualifiedNames.push(stocksArr[i].symbol);
                }
            }
        }
        
        ratio=100*qualifiedCounter/stocksArr.length;
        
        return [ratio, qualifiedNames];
        
    }
    
    
    toggleStatistics(){
        
        this.isStatistics ? this.isStatistics=false : this.isStatistics=true;   
    }
    
    toggleQualifiedStocksNames(num){
     
        this.isShowQualifiedStocksNames[num] ? this.isShowQualifiedStocksNames[num]=false : this.isShowQualifiedStocksNames[num]=true;
    }
    
    
    expandCollapseList(){
        
        if(this.isShowAllList){
                this.isShowAllList=false;
                this.expandOrCollapse='Expand';  
        }else{
                this.isShowAllList=true;
                this.expandOrCollapse='Collapse';   
            
        }
           
    }
    
    
    
    
    @HostListener('window:resize', ['$event'])
    onResize(event) {
       
        let windowWidth = event.target.innerWidth;
        
        if(windowWidth<780 /* has to match to the max-width in the CSS file*/){
            this.positionChngWidth=30;
            this.isShowPositionChngV ? this.stockNameWidth=130 : this.stockNameWidth=160;
        }else{
            this.positionChngWidth=40;
            this.isShowPositionChngV ? this.stockNameWidth=250 : this.stockNameWidth=290;
        }
        
    }
    
    
    

}



