import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AssetDataService } from '../services/asset-data.service';
import { TopAssetsPerformanceComponent } from '../top-assets-performance/top-assets-performance.component';
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
    
    observable: Observable<any>;
    assetsData=[];
    propArr=['dayReturn','yearReturn','lowInPerc','highInPerc'];
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
    showOnHover=''; // delete me when there is a better form of showing high and low in the bar chart...
    isShowOnHover=false; // same here!
    hoverIndex=-1 // same here!
    
    chartDuration = '';

  constructor( private assetDataService: AssetDataService, private utils: UtilsService) { }

  ngOnInit() {
      this.createStatistics();
      this.createPerformanceChart();
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
            this.assetsForPerformance[i].name!="FAANG" ? symbolsURL+=this.assetsForPerformance[i].symbol+"," : indexOfFAANG=i;
        }
        
        symbolsURL+=faangSymbols;
        
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
                       assetsArr[i]['dataToShow']=value;
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
        }
        else if(this.assetsForPerformance[0].dataToShow>0 && this.assetsForPerformance[0].dataToShow>this.averagePercChng && this.advancers<this.decliners){
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
    
    showHighAndLow(index){  // delete when better function exists in bar-chart...
        let lowIndex = this.propArr.indexOf('lowInPerc');
        let highIndex = this.propArr.indexOf('highInPerc');
        let assetLowInPerc = this.assetsData[index][lowIndex];
        let assetHighInPerc = this.assetsData[index][highIndex];
        this.showOnHover = `${assetLowInPerc.toFixed(2)}%
                            ${assetHighInPerc.toFixed(2)}%`;
        this.isShowOnHover = true;
        this.hoverIndex = index;
    }
    
    stopShowing(){
        this.isShowOnHover=false; 
        this.hoverIndex = -1;  
    }
    
    

}

