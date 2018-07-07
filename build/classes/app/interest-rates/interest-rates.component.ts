import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { AssetDataService } from '../services/asset-data.service';
import { TopAssetsPerformanceComponent } from '../top-assets-performance/top-assets-performance.component';
import { WindowService } from '../services/window.service';
import { ChartsService } from '../services/Charts.service';
import { UtilsService } from '../services/utils.service';

import { Observable } from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-interest-rates',
  templateUrl: './interest-rates.component.html',
  styleUrls: ['./interest-rates.component.css']
})
export class InterestRatesComponent implements OnInit {
    
    @ViewChild('chart') chart:ElementRef;

    fedFundsArr =  [{name:"06/18", symbol:"ZQM18", dataToShow:null},
                    {name:"09/18", symbol:"ZQU18", dataToShow:null},
                    {name:"12/18", symbol:"ZQZ18", dataToShow:null},
                    {name:"03/19", symbol:"ZQH19", dataToShow:null},
                    {name:"06/19", symbol:"ZQM19", dataToShow:null},
                    {name:"09/19", symbol:"ZQU19", dataToShow:null},
                    {name:"12/19", symbol:"ZQZ19", dataToShow:null},
                    {name:"03/20", symbol:"ZQH20", dataToShow:null},
                    {name:"06/20", symbol:"ZQM20", dataToShow:null},
                    {name:"09/20", symbol:"ZQU20", dataToShow:null},
                    {name:"12/20", symbol:"ZQZ20", dataToShow:null},
                    {name:"03/21", symbol:"ZQH21", dataToShow:null},
                    ];
    
    eurodollarArr = [{name:"06/18", symbol:"GEM18", dataToShow:null},
                    {name:"09/18", symbol:"GEU18", dataToShow:null},
                    {name:"12/18", symbol:"GEZ18", dataToShow:null},
                    {name:"03/19", symbol:"GEH19", dataToShow:null},
                    {name:"06/19", symbol:"GEM19", dataToShow:null},
                    {name:"09/19", symbol:"GEU19", dataToShow:null},
                    {name:"12/19", symbol:"GEZ19", dataToShow:null},
                    {name:"03/20", symbol:"GEH20", dataToShow:null},
                    {name:"06/20", symbol:"GEM20", dataToShow:null},
                    {name:"09/20", symbol:"GEU20", dataToShow:null},
                    {name:"12/20", symbol:"GEZ20", dataToShow:null},
                    {name:"03/21", symbol:"GEH21", dataToShow:null},
                    ];
    
    euriborArr =   [{name:"06/18", symbol:"FEM18", dataToShow:null},
                    {name:"09/18", symbol:"FEU18", dataToShow:null},
                    {name:"12/18", symbol:"FEZ18", dataToShow:null},
                    {name:"03/19", symbol:"FEH19", dataToShow:null},
                    {name:"06/19", symbol:"FEM19", dataToShow:null},
                    {name:"09/19", symbol:"FEU19", dataToShow:null},
                    {name:"12/19", symbol:"FEZ19", dataToShow:null},
                    {name:"03/20", symbol:"FEH20", dataToShow:null},
                    {name:"06/20", symbol:"FEM20", dataToShow:null},
                    {name:"09/20", symbol:"FEU20", dataToShow:null},
                    {name:"12/20", symbol:"FEZ20", dataToShow:null},
                    {name:"03/21", symbol:"FEH21", dataToShow:null},
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
        svg: true,
        polylinePoints: '',
        circleXY:[],    // coordinates for small circles
        gridLineActive: true,
    }
    chartPropertiesEurodollar={
        type:'Line Chart',
        totalBarsWidth:88, 
        totalChartHeight:null, 
        totalChartWidth:null,     
        topMargin:50,       
        bottomMargin:50,
        xAxisTop:null,
        DADP:3,              
        roundTarget: 0.1,    
        lowestIsZero:true,   
        svg: true,
        polylinePoints: '',
        circleXY:[],   
        gridLineActive: true,
    }
    chartPropertiesEuribor={
        type:'Line Chart',
        totalBarsWidth:88, 
        totalChartHeight:null, 
        totalChartWidth:null,     
        topMargin:50,       
        bottomMargin:50,
        xAxisTop:null,
        DADP:3,              
        roundTarget: 0.1,    
        lowestIsZero:false,  // because euribor has negative yield... 
        svg: true,
        polylinePoints: '',
        circleXY:[],   
        gridLineActive: true,
    }

    observable: Observable<any[]>;
    obtainedAssetsData=false;
    isShowChart=false;
    hasHeight=false;
    alreadyCompensatedForMobile=false;
    alreadyCompensatedForDesktop=false;
    safeTransform;
    indexOfDataPopUp=-1;
    change = 0;
    assetsContainer = [this.fedFundsArr, this.eurodollarArr, this.euriborArr];  // the order is important
    allSymbolsArr = [];
    XHRCallDivider = 25;   // divide XHR calls
    XHRCallCounter = 0;    // count how many XHR calls were
    allAssetsData = [];


    constructor( private assetDataService: AssetDataService, private windowService: WindowService, private charts: ChartsService, 
                 private utils: UtilsService, private sanitizer: DomSanitizer) { }

    ngOnInit(){
        this.generateChart();
    }

    
    generateChart(){
        this.allSymbolsArr = this.packAllSymbolsInArr(this.assetsContainer);
        this.utils.divideXHRCalls(this.allSymbolsArr,this.XHRCallDivider,this.getSubData.bind(this));
    }

    packAllSymbolsInArr(assetsContainer):any[]{
        let symbolsArr = [];
        for(let i=0; i<assetsContainer.length; i++){
            let assetTimeSeries = assetsContainer[i];
            for(let j=0; j<assetTimeSeries.length; j++){
                symbolsArr.push(assetTimeSeries[j].symbol);
            }
        }
        return symbolsArr;
    }
    
    getSubData(subSymbolsArr){
        let counter = ++this.XHRCallCounter;
        this.observable = this.assetDataService.getMultipleAssetsData(subSymbolsArr);
        this.observable.subscribe(assetsData => {
            this.utils.doOnlyWhen(function(){
                    this.parseDataOnlyIfAllDataArrived(assetsData);
                }.bind(this), function(){
                        return !!((counter-1)*this.XHRCallDivider == this.allAssetsData.length);
                    }.bind(this), 20, 1000, function(){
                        console.log("data didn't arrive in full :(");
                        }
            );
        });   
    }
    
    parseDataOnlyIfAllDataArrived(assetsData){
        for(let i=0; i<assetsData.length; i++){
            this.allAssetsData.push(assetsData[i]);
        }
        if(this.allAssetsData.length == this.allSymbolsArr.length){
            this.parseData(this.allAssetsData);
        }
        else return;
    }
    
    parseData(assetsData){
        let startingPoint = 0;
        for(let i=0; i<this.assetsContainer.length; i++){
            let assetTimeSeries = this.assetsContainer[i];
            for(let j=0; j<assetTimeSeries.length; j++){
                assetTimeSeries[j].dataToShow = 100 -assetsData[startingPoint+j].lastPrice;
            }
            startingPoint += this.assetsContainer[i].length;
        }
        this.isShowChart=true;
    }
    
    /* don't need it anymore. just an example to DomSanitizer */
    generateSafeTransform(arr:any[]){   // must use the DomSanitizer here otherwise [style.transform] won't work
        for(let i=0; i<arr.length; i++){
            arr[i].safeTransform=this.sanitizer.bypassSecurityTrustStyle('rotate('+arr[i].degrees+'deg)')
        }
    }
    

}
