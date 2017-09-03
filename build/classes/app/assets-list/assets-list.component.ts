import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset';
import { AssetsService } from '../services/assets.service';
import { WindowService } from '../services/window.service';

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

  constructor(private assetsService: AssetsService, private windowService: WindowService) { }

  ngOnInit() {
      
     this.assetsService.getAllAssetsByType("Stock").then(assets => {this.stocksList=assets.sort(compare)}) ;
     this.assetsService.getAllAssetsByType("Currency").then(assets => this.currenciesList=assets.sort(compare)) ;
     this.assetsService.getAllAssetsByType("Commodity").then(assets => this.commoditiesList=assets.sort(compare)) ;
     this.assetsService.getAllAssetsByType("Future").then(assets => this.futuresList=assets.sort(compare)) ;
     this.assetsService.getAllAssetsByType("ETF").then(assets => this.etfList=assets.sort(compare)) ;
     
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


function compare(a,b) {
      if (a.nameToShow < b.nameToShow)
        return -1;
      if (a.nameToShow > b.nameToShow)
        return 1;
      return 0;
    }
