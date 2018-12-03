import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset';
import { AssetsService } from '../services/assets.service';
import { WindowService } from '../services/window.service';
import { UtilsService } from '../services/utils.service';

import { AssetDataService } from '../services/asset-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.css']
})
export class AssetsListComponent implements OnInit {
    
    stocksList:Asset[]=[]    
    currenciesList:Asset[]=[]
    commoditiesList:Asset[]=[]
    futuresList:Asset[]=[]
    etfList:Asset[]=[]
    isShowStocks=true;
    isShowCurrencies=true;
    isShowCommodities=true;
    isShowFutures=true;
    isShowETF=true;
    windowWidth;

  constructor(private assetsService: AssetsService, private windowService: WindowService, private utils: UtilsService,private assetData: AssetDataService) { }

  ngOnInit() {
//      this.assetData.getBlabla().subscribe(data =>{console.log(data.json().results)});    for NodeJs practice...
      
     this.assetsService.getAllVisibleAssetsByType("Stock").then(assets => {this.stocksList=assets.sort(this.utils.compare(['nameToShow'],true))}) ;
     this.assetsService.getAllVisibleAssetsByType("Currency").then(assets => this.currenciesList=assets.sort(this.utils.compare(['nameToShow'],true))) ;
     this.assetsService.getAllVisibleAssetsByType("Commodity").then(assets => this.commoditiesList=assets.sort(this.utils.compare(['nameToShow'],true))) ;
     this.assetsService.getAllVisibleAssetsByType("Future").then(assets => this.futuresList=assets.sort(this.utils.compare(['nameToShow'],true))) ;
     this.assetsService.getAllVisibleAssetsByType("ETF").then(assets => this.etfList=assets.sort(this.utils.compare(['nameToShow'],true))) ;
     
      this.windowWidth=this.windowService.getNativeWindow().innerWidth;
      if(this.windowWidth<500){
          this.isShowStocks=false;
          this.isShowCurrencies=false;
          this.isShowCommodities=false;
          this.isShowFutures=false;
          this.isShowETF=false;
      }
  }
    
    

    toggleStocksView(){
    
        if(this.windowWidth<500){   // only for mobile...
       
            if(this.isShowStocks){
                this.isShowStocks=false;    
            }else{
                this.isShowStocks=true;  
            }
        
        }
        
    }



    toggleCurrenciesView(){
       
        if(this.windowWidth<500){   // only for mobile...
            if(this.isShowCurrencies){
                this.isShowCurrencies=false;    
            }else{
                this.isShowCurrencies=true;  
             }
         }   
        
    }


    toggleCommoditiesView(){
    
        if(this.windowWidth<500){   // only for mobile...
           
            if(this.isShowCommodities){
                this.isShowCommodities=false;    
            }else{
                this.isShowCommodities=true;  
             }
         }   
        
    }



    toggleEtfView(){
    
        if(this.windowWidth<500){   // only for mobile...
           
            if(this.isShowETF){
                this.isShowETF=false;    
            }else{
                this.isShowETF=true;  
             }
         }   
        
    }
    
    
    toggleFuturesView(){
    
        if(this.windowWidth<500){   // only for mobile...
           
            if(this.isShowFutures){
                this.isShowFutures=false;    
            }else{
                this.isShowFutures=true;  
            }
         }   
        
    }



}

