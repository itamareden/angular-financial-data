import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AssetDataService } from '../services/asset-data.service';
import { TopAssetsPerformanceComponent } from '../top-assets-performance/top-assets-performance.component';
import { UtilsService } from '../services/utils.service';
import { BarChartConfig } from '../classes/bar-chart-config';
import { ChartData } from '../classes/chart-data';

import { Observable } from 'rxjs';

@Component({
  selector: 'stocks-statistics',
  templateUrl: './stocks-statistics.component.html',
  styleUrls: ['./stocks-statistics.component.css']
})
export class StocksStatisticsComponent implements OnInit {
        
    @ViewChild('chart') chart:ElementRef;
    
    chartConfig = {
        type:'Bar Chart',
        totalBarsWidth:90,  // width of each bar in %
        totalChartHeight:null,
        totalChartWidth:null,   
        topMargin:40,        // a small space from the top of the chart to the bars area..
        bottomMargin:30,
        xAxisTop:null,
        isShowBarData: true,
        barDataPattern: [/([-]?\d+[.]?\d{0,2}).*/g, "$1%"],
        enableTooltip: false,
        colorMultiplier: 1.4,
    }
    
    assetsForPerformance = [
                            new ChartData("S&P", "SPY", [], [""], ['#f7ec5b']),
                            new ChartData("Nasdaq", "QQQ", [], [""], ['#96f762']),
                            new ChartData("Trans", "IYT", [], [""], ['#66f4b4']),
                            new ChartData("Bio", "XBI", [], [""], ['#61e3f9']),
                            new ChartData("Banks", "XLF", [], [""], ['#0099cc']),
                            new ChartData("Russel", "IWM", [], [""], ['#008080']),
                            new ChartData("FAANG", "FB", [], [""], ['#5d65f7']),
                            new ChartData("Bonds", "TLT", [], [""], ['#cf59f9']),
                            new ChartData("HY", "HYG", [], [""], ['#fc605a']),
                            ];
    
    chartConfig2 = new BarChartConfig(90, 40, 30, true, false, 1.4);
    
    observable: Observable<any>;
    assetsData=[];
    propArr=['dayReturn','yearReturn'];
    dataProp='';
    advancers : number = 0;
    decliners : number = 0;
    unchanged : number = 0;
    averagePercChng : number = 0;
    breadth="";
    isShowStatistics=false;
    isShowComponent=false;
    obtainedAssetsData=false;
    alreadyCompensatedForMobile=false;
    alreadyCompensatedForDesktop=false;
    isSettings=false;
    isShowYearlyChngV=false;
    
    chartDuration = '';
    

  constructor( private assetDataService: AssetDataService, private utils: UtilsService) { }

  ngOnInit() {
      this.createStatistics();
      this.createPerformanceChart();
//      this.chartDuration = 'day';
//      this.isShowComponent=true;
  }
    
    
    createPerformanceChart(){
        this.assetsData=this.getAssetsData(this.propArr);
        let classScope=this; 
        let interval=setInterval(function(){
              if(classScope.obtainedAssetsData){
                  clearInterval(interval);
                  classScope.updateDataToShow('dayReturn', classScope.propArr, classScope.assetsData, classScope.assetsForPerformance);
                  classScope.dataProp='dayReturn'
                  classScope.chartDuration = "day"; // makes <bar-chart> come to life and starts its process
              }
             },500);
    }
    
    
    getAssetsData(properties:any[]):any[]{
        
        let symbolsURL="";
        let indexOfFAANG=null;
        let faangSymbols="FB,AAPL,AMZN,NFLX,GOOG";
        let propLength=properties.length;
        let dataToReturn=[];
        
        for(let i=0; i<this.assetsForPerformance.length; i++){
            // concatenate symbols if not FAANG. FAANG is concatenated last for simplicity...
            this.assetsForPerformance[i].name!="FAANG" ? symbolsURL += this.assetsForPerformance[i].symbol + "," : indexOfFAANG = i;
        }
        
        symbolsURL += faangSymbols;
        
        this.observable = this.assetDataService.getMultipleAssetsData(symbolsURL,'stock-statistics',['twelveMnthPct']);
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
//                       assetsArr[i]['dataToShow']=value;
                    assetsArr[i].dataArr.push(value);
                }
            }
    }
    
    
    toggleChartData(){
           if(this.dataProp=='dayReturn'){
               this.updateDataToShow('yearReturn', this.propArr, this.assetsData, this.assetsForPerformance);
               this.chartDuration = "year";
               this.dataProp='yearReturn';
               this.isShowYearlyChngV=true;
           }else{
               this.updateDataToShow('dayReturn', this.propArr, this.assetsData, this.assetsForPerformance);
               this.chartDuration = "day";
               this.dataProp='dayReturn';
               this.isShowYearlyChngV=false;
           }
    }
    
    
    createStatistics(){
       
       let classScope=this; 
       let interval=setInterval(function(){
          if(TopAssetsPerformanceComponent.assetsData.length>75){
              clearInterval(interval);
              classScope.calculateStatistics();
          }
         },200);  
        
    }
    
    
    calculateStatistics(){
        let stocksArr=TopAssetsPerformanceComponent.assetsData.slice();
        stocksArr.sort(this.utils.compare('dayReturn')); 
        console.log('length of average data is: '+stocksArr.length);
        for(let i=0; i<stocksArr.length; i++){
            this.averagePercChng+=stocksArr[i].netChangePercent;  
            if(stocksArr[i].netChangePercent>0){   
                this.advancers++;
            }
            else if(stocksArr[i].netChangePercent<0){
                 this.decliners++;
            }
            else{
                  this.unchanged++;
            }
        }
        this.advancers=100*this.advancers/stocksArr.length;
        this.decliners=100*this.decliners/stocksArr.length;
        this.unchanged=100*this.unchanged/stocksArr.length;
        this.averagePercChng/=stocksArr.length;
        
        let classScope=this; 
        let interval=setInterval(function(){
            // proceed only after the last item in the array has dataToShow 
              if(classScope.assetsForPerformance[classScope.assetsForPerformance.length-1].dataArr.length > 0){
                  clearInterval(interval);
                  classScope.calculateBreadth();
              }
             },200); 
    
        this.isShowStatistics=true;
        this.isShowComponent=true;
        
    }
    
    calculateBreadth(){
        if(this.assetsForPerformance[0].totalDataSum < 0 && this.assetsForPerformance[0].totalDataSum < this.averagePercChng && this.advancers > this.decliners){
                this.breadth="Positive";
        }
        else if(this.assetsForPerformance[0].totalDataSum > 0 && this.assetsForPerformance[0].totalDataSum > this.averagePercChng && this.advancers < this.decliners){
                 this.breadth="Negative";
        }
        else{
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
    
}

