import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AssetDataService } from '../services/asset-data.service';
import { AssetInAssetsTable } from '../asset-in-assets-table'
import { TopAssetsPerformanceComponent } from '../top-assets-performance/top-assets-performance.component';
import { WindowService } from '../services/window.service';
import { ChartsService } from '../services/Charts.service';

import { Observable } from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-interest-rates',
  templateUrl: './interest-rates.component.html',
  styleUrls: ['./interest-rates.component.css']
})
export class InterestRatesComponent implements OnInit {
    
    @ViewChild('chart') chart:ElementRef;

    fedFundsArr =  [{name:"03/18", symbol:"ZQH18", lastPrice:1.5, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"06/18", symbol:"ZQM18", lastPrice:2.2, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"09/18", symbol:"ZQU18", lastPrice:1.4, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"12/18", symbol:"ZQZ18", lastPrice:1.23, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"03/19", symbol:"ZQH19", lastPrice:2.1, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"06/19", symbol:"ZQM19", lastPrice:2.34, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"09/19", symbol:"ZQU19", lastPrice:1.98, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"12/19", symbol:"ZQZ19", lastPrice:2.19, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"03/20", symbol:"ZQH20", lastPrice:2.66, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"06/20", symbol:"ZQM20", lastPrice:2.99, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"09/20", symbol:"ZQU20", lastPrice:2.43, color1:'#66d9ff', color2:'#0099cc'},
                    {name:"12/20", symbol:"ZQZ20", lastPrice:1.12, color1:'#66d9ff', color2:'#0099cc'},
                    ];
    
    eurodollarArr = [{name:"03/18", symbol:"GEH18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"06/18", symbol:"GEM18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"09/18", symbol:"GEU18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"12/18", symbol:"GEZ18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"03/19", symbol:"GEH19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"06/19", symbol:"GEM19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"09/19", symbol:"GEU19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"12/19", symbol:"GEZ19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"03/20", symbol:"GEH20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"06/20", symbol:"GEM20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"09/20", symbol:"GEU20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"12/20", symbol:"GEZ20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    ];
    
    euriborArr =   [{name:"03/18", symbol:"FEH18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"06/18", symbol:"FEM18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"09/18", symbol:"FEU18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"12/18", symbol:"FEZ18", lastPrice:null, color1:'#d1f6fc', color2:'#61e3f9', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"03/19", symbol:"FEH19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"06/19", symbol:"FEM19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"09/19", symbol:"FEU19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"12/19", symbol:"FEZ19", lastPrice:null, color1:'#66d9ff', color2:'#0099cc', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"03/20", symbol:"FEH20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"06/20", symbol:"FEM20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"09/20", symbol:"FEU20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    {name:"12/20", symbol:"FEZ20", lastPrice:null, color1:'#ffdd99', color2:'#ffcc66', left:null, top:null, width:null, height:null, returnTop:null},
                    ];

    chartPropertiesFedFunds={
        type:'Line Chart',
        totalBarsWidth:88,  // width of each bar in %
        totalChartHeight:null, 
        totalChartWidth:null,     
        topMargin:50,        // a small space from the top of the chart to the bars area..
        bottomMargin:50,
        xAxisTop:null,
        DADP:3,              // digits after decimal point
        roundTarget: 0.1,     // for example 1.485 => 1.4 or 1.5.  2.36 => 2.30 or 2.40, depends if we round up or down.
        lowestIsZero:true,   // compel the lowest value to be zero.
    }
    chartPropertiesEurodollar={
        type:'Bar Chart',
        totalBarsWidth:88,  // width of each bar in %
        totalChartHeight:null,   
        topMargin:50,        // a small space from the top of the chart to the bars area..
        bottomMargin:50,
        xAxisTop:null,
    }
    chartPropertiesEuribor={
        type:'Bar Chart',
        totalBarsWidth:88,  // width of each bar in %
        totalChartHeight:null,   
        topMargin:50,        // a small space from the top of the chart to the bars area..
        bottomMargin:50,
        xAxisTop:null,
    }

    observableAssetsTable: Observable<AssetInAssetsTable[]>;
    obtainedAssetsData=false;
    isShowTable=false;
    hasHeight=false;
    alreadyCompensatedForMobile=false;
    alreadyCompensatedForDesktop=false;
    safeTransform;
    indexOfDataPopUp=-1;



    constructor( private assetDataService: AssetDataService, private windowService: WindowService, private charts: ChartsService, private sanitizer: DomSanitizer) { }

    ngOnInit(){
    }

    ngAfterViewChecked() {
        if(this.chart && !this.hasHeight){
            this.hasHeight=true;
            this.chartPropertiesFedFunds.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.chartPropertiesFedFunds.totalChartWidth=this.chart.nativeElement.offsetWidth;
            this.chartPropertiesEurodollar.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.chartPropertiesEuribor.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.createPerformanceChart();
            
            let windowWidth=this.windowService.getNativeWindow().innerWidth;
            windowWidth <= 400 ? this.alreadyCompensatedForMobile = true : this.alreadyCompensatedForDesktop = true;
        }
   }


    createPerformanceChart(){
        
        this.getAssetsData();
        //this.obtainedAssetsData=true  // DELETEEEEEEEEEEEEEE
        let classScope=this; 
        let interval=setInterval(function(){
              if(classScope.obtainedAssetsData){
                  clearInterval(interval);
                  classScope.charts.createLineChart(classScope.fedFundsArr, classScope.chartPropertiesFedFunds, 'lastPrice', true);
                  classScope.generateSafeTransform(classScope.fedFundsArr);
                  classScope.charts.createBarChart(classScope.eurodollarArr, classScope.chartPropertiesEurodollar, 'lastPrice');
                  classScope.charts.createBarChart(classScope.euriborArr, classScope.chartPropertiesEuribor, 'lastPrice');
                  classScope.isShowTable=true;
                  console.log(classScope.fedFundsArr)
              }
             },200);
        
    }


    getAssetsData(){
        
        let symbolsURL="";
        
        for(let i=0; i<this.fedFundsArr.length; i++){
            symbolsURL+=this.fedFundsArr[i].symbol+",";
        }
        for(let i=0; i<this.eurodollarArr.length; i++){
            symbolsURL+=this.eurodollarArr[i].symbol+",";
        }
        for(let i=0; i<this.euriborArr.length; i++){
            symbolsURL+=this.euriborArr[i].symbol+",";
        }
        
        this.observableAssetsTable = this.assetDataService.getMultipleAssetsData(symbolsURL);
        this.observableAssetsTable.subscribe(assetsData => {
             
             this.fedFundsArr.map((item,i) => { 
                item.lastPrice = 100 - assetsData[i].lastPrice
              });
             let positionStart=this.fedFundsArr.length;
             this.eurodollarArr.map((item,i) => { 
                item.lastPrice = 100 - assetsData[i+positionStart].lastPrice
              });
             positionStart+=this.eurodollarArr.length;
             this.euriborArr.map((item,i) => { 
                item.lastPrice = 100 - assetsData[i+positionStart].lastPrice
              });
            
             this.obtainedAssetsData=true;
        });
        
    }
    
    toggleDataPopUp(i:number){
        this.indexOfDataPopUp>0 ? this.indexOfDataPopUp=-1 : this.indexOfDataPopUp=i;
    }
    
    
    generateSafeTransform(arr:any[]){   // must use the DomSanitizer here otherwise [style.transform] won't work
        for(let i=0; i<arr.length; i++){
            arr[i].safeTransform=this.sanitizer.bypassSecurityTrustStyle('rotate('+arr[i].degrees+'deg)')
        }
    }


    @HostListener('window:resize', ['$event'])
    onResize(event) {
       
        let windowWidth = event.target.innerWidth;
        
        if(windowWidth <= 400){
            if(!this.alreadyCompensatedForMobile){
                this.chartPropertiesFedFunds.totalChartHeight=this.chart.nativeElement.offsetHeight;
                this.charts.createBarChart(this.fedFundsArr, this.chartPropertiesFedFunds, 'lastPrice');
                this.chartPropertiesEurodollar.totalChartHeight=this.chart.nativeElement.offsetHeight;
                this.charts.createBarChart(this.eurodollarArr, this.chartPropertiesEurodollar, 'lastPrice');
                this.chartPropertiesEuribor.totalChartHeight=this.chart.nativeElement.offsetHeight;
                this.charts.createBarChart(this.euriborArr, this.chartPropertiesEuribor, 'lastPrice');
                this.alreadyCompensatedForMobile=true;
                this.alreadyCompensatedForDesktop=false;
            }
        }else if(!this.alreadyCompensatedForDesktop){
            this.chartPropertiesFedFunds.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.charts.createBarChart(this.fedFundsArr, this.chartPropertiesFedFunds, 'lastPrice');
            this.chartPropertiesEurodollar.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.charts.createBarChart(this.eurodollarArr, this.chartPropertiesEurodollar, 'lastPrice');
            this.chartPropertiesEuribor.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.charts.createBarChart(this.euriborArr, this.chartPropertiesEuribor, 'lastPrice');
            this.alreadyCompensatedForDesktop=true;
            this.alreadyCompensatedForMobile=false;
        }
    }

}
