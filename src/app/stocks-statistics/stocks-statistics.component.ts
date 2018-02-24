import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AssetDataService } from '../services/asset-data.service';
import { AssetInRelativePerformance } from '../asset-in-relative-performance'
import { TopAssetsPerformanceComponent } from '../top-assets-performance/top-assets-performance.component';
import { WindowService } from '../services/window.service';
import { ChartsService } from '../services/Charts.service';
import { UtilsService } from '../services/utils.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'stocks-statistics',
  templateUrl: './stocks-statistics.component.html',
  styleUrls: ['./stocks-statistics.component.css']
})
export class StocksStatisticsComponent implements OnInit {
        
    @ViewChild('chart') chart:ElementRef;
    
    assetsForPerformance = [{name:"S&P", symbol:"SPY", dataToShow:null, color1:'#f9f189', color2:'#f7ec5b', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Nasdaq", symbol:"QQQ", dataToShow:null, color1:'#aff986', color2:'#96f762', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Trans", symbol:"IYT", dataToShow:null, color1:'#8ff7c8', color2:'#66f4b4', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Bio", symbol:"XBI", dataToShow:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Banks", symbol:"XLF", dataToShow:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Russel", symbol:"IWM", dataToShow:null, color1:'#00cccc', color2:'#008080', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"FAANG", symbol:"FB", dataToShow:null, color1:'#c5c8f7', color2:'#5d65f7', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"Bonds", symbol:"TLT", dataToShow:null, color1:'#e1abf4', color2:'#cf59f9', left:null, top:null, width:null, height:null, returnTop:null},
                            {name:"HYG", symbol:"HYG", dataToShow:null, color1:'#f9aaa7', color2:'#fc605a', left:null, top:null, width:null, height:null, returnTop:null},
                            ];
    
    chartProperties={
        type:'Bar Chart',
        totalBarsWidth:90,  // width of each bar in %
        totalChartHeight:null,
        totalChartWidth:null,   
        topMargin:40,        // a small space from the top of the chart to the bars area..
        bottomMargin:30,
        xAxisTop:null,
    }
    
    observable: Observable<AssetInRelativePerformance[]>;
    assetsData=[];
    propArr=['dayReturn','yearReturn'];
    dataProp='';
    advancers : number = 0;
    decliners : number = 0;
    unchanged : number = 0;
    averagePercChng : number = 0;
    breadth="";
    isShowStatistics=false;
    isShowTable=false; 
    isShowComponent=false;
    obtainedAssetsData=false;
    hasHeight=false;
    alreadyCompensatedForMobile=false;
    alreadyCompensatedForDesktop=false;
    isSettings=false;
    isShowYearlyChngV=false;

  constructor( private assetDataService: AssetDataService, private windowService: WindowService, private charts: ChartsService,
            private utils: UtilsService) { }

  ngOnInit() {
      this.createStatistics();
  }
    
  ngAfterViewChecked() {
        if(this.chart && !this.hasHeight){
            this.hasHeight=true;
            this.chartProperties.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.chartProperties.totalChartWidth=this.chart.nativeElement.offsetWidth;
            this.createPerformanceChart();
            
            let windowWidth=this.windowService.getNativeWindow().innerWidth;
            windowWidth <= 400 ? this.alreadyCompensatedForMobile = true : this.alreadyCompensatedForDesktop = true;
        }
   }
    
    
    createPerformanceChart(){
        
        this.assetsData=this.getAssetsData(this.propArr);
        
        let classScope=this; 
        let interval=setInterval(function(){
              if(classScope.obtainedAssetsData){
                  clearInterval(interval);
                  classScope.updateDataToShow('dayReturn', classScope.propArr, classScope.assetsData, classScope.assetsForPerformance);
                  classScope.charts.createBarChart(classScope.assetsForPerformance, classScope.chartProperties, 'dataToShow');
                  classScope.dataProp='dayReturn'
                  classScope.isShowTable=true;
              }
             },200);
        
    }
    
    
    getAssetsData(properties:any[]):any[]{
        
        let symbolsURL="";
        let indexOfFAANG=null;
        let faangSymbols="FB,AAPL,AMZN,NFLX,GOOG";
        let propLength=properties.length;
        let dataToReturn=[];
        
        for(let i=0; i<this.assetsForPerformance.length; i++){
            // concatenate symbols if not FAANG. FAANG is concatenated last for simplicity...
            this.assetsForPerformance[i].name!="FAANG" ? symbolsURL+=this.assetsForPerformance[i].symbol+"," : indexOfFAANG=i;
        }
        
        symbolsURL+=faangSymbols;
        
        this.observable = this.assetDataService.getMultipleAssetsData2(symbolsURL);
        this.observable.subscribe(assetsData => {
            
                let onlyFaang=assetsData.splice(assetsData.length-5,5); // get only FAANG net percent change.
                let faangDataArr=[];
                
                
                for(let i=0; i<propLength; i++){
                    let faangData=0;
                    let prop=properties[i];
                    for(let j=0; j<onlyFaang.length; j++){
                        faangData+=onlyFaang[j][prop];
                        
                    }
                    faangData/=5;    // FAANG is comprised of 5 stocks...
                    faangDataArr.push(faangData);
                }
                dataToReturn[indexOfFAANG]=faangDataArr; 
                
                
                let j=0;
                
                let assetData;
                    
                for(let i=0; i<assetsData.length; i++){
                    let assetDataArr=[];
                    // if it's FAANG, move on to next element in the assetsForPerformance
                    i==indexOfFAANG ? j++ : null;
                    for(let k=0; k<propLength; k++){
                        let prop=properties[k];
                        assetData=assetsData[i][prop];
                        assetDataArr.push(assetData);
                    }
                    dataToReturn[j]=assetDataArr;
                    j++;
                }
                
                this.obtainedAssetsData=true;
                
            });
            return dataToReturn;
        
    }
    
    
    updateDataToShow(propertyName:string, propArr:string[], assetsData:any[], assetsArr:any[]){   // update the dataToShow property of the objects inside assetsForPerformance
    // assetsArr is the main array with the objects (each object is an asset)
    // propArr is the array with the properties to look for, for each asset
            let index=propArr.indexOf(propertyName);
            if(index > -1 && assetsData && assetsData.length){
                for(let i=0; i<assetsData.length; i++){
                    let assetArr=assetsData[i];  // each item inside assetsData is an array on its own...   
                    let value=assetArr[index];
                       assetsArr[i]['dataToShow']=value;
                }
            }
    }
    
    
    changeChartDataBasedOnProp(propName:string){
        this.updateDataToShow(propName, this.propArr, this.assetsData, this.assetsForPerformance);
        this.charts.createBarChart(this.assetsForPerformance, this.chartProperties, 'dataToShow');
    }
    
    toggleChartData(){
           if(this.dataProp=='dayReturn'){
               this.changeChartDataBasedOnProp('yearReturn');
               this.dataProp='yearReturn';
               this.isShowYearlyChngV=true;
           }else{
               this.changeChartDataBasedOnProp('dayReturn');
               this.dataProp='dayReturn';
               this.isShowYearlyChngV=false;
           }
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
    
    
    
    calculateStatistics(){
        
        let stocksArr=TopAssetsPerformanceComponent.assetsData.slice();
        stocksArr.sort(this.utils.compareAssetsBasedOnProp('dayReturn')); 
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
                // proceed only after the last item in the array has dataToShow 
                  if(classScope.assetsForPerformance[classScope.assetsForPerformance.length-1].dataToShow!=null){
                      clearInterval(interval);
                      classScope.calculateBreadth();
                  }
                 },200); 
        
            this.isShowStatistics=true;
            this.isShowComponent=true;
        
    }
    
    calculateBreadth(){
        
        if(this.assetsForPerformance[0].dataToShow<0 && this.assetsForPerformance[0].dataToShow<this.averagePercChng && this.advancers>this.decliners){
                this.breadth="Positive";
        }else if(this.assetsForPerformance[0].dataToShow>0 && this.assetsForPerformance[0].dataToShow>this.averagePercChng && this.advancers<this.decliners){
                 this.breadth="Negative";
         }else{
                this.breadth="Neutral";
          }
        
        
    }
    
    
    toggleSettings(){
        if(this.isSettings){
            this.isSettings=false;   
        }else{
            this.isSettings=true;
        }   
    }
    
    
    @HostListener('window:resize', ['$event'])
    onResize(event) {
       
        let windowWidth = event.target.innerWidth;
        
        if(windowWidth <= 400){
            if(!this.alreadyCompensatedForMobile){
                this.chartProperties.totalChartHeight=this.chart.nativeElement.offsetHeight;
                this.charts.createBarChart(this.assetsForPerformance, this.chartProperties, 'dataToShow');
                this.alreadyCompensatedForMobile=true;
                this.alreadyCompensatedForDesktop=false;
            }
        }else if(!this.alreadyCompensatedForDesktop){
            this.chartProperties.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.charts.createBarChart(this.assetsForPerformance, this.chartProperties, 'dataToShow');
            this.alreadyCompensatedForDesktop=true;
            this.alreadyCompensatedForMobile=false;
        }
    }
    
    

}



