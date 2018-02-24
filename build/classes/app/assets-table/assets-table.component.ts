import { Component, OnInit , Input } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { AssetInAssetsTable } from '../asset-in-assets-table'
import { AssetPerformance } from '../asset-performance'

import { Observable } from 'rxjs';


@Component({
  selector: 'assets-table',
  templateUrl: './assets-table.component.html',
  styleUrls: ['./assets-table.component.css'],
  host: {
        '(document:click)': 'handleClick($event)',
    },
})
export class AssetsTableComponent implements OnInit {
        
    symbolsURL:string="^EURUSD,^GBPUSD,^USDJPY,^AUDUSD,^NZDUSD,^USDCAD,^USDZAR,^USDMXN,^USDBRL,^USDTRY,^USDPLN,^USDHUF,^XAUUSD,^XAGUSD,HGH18,CLG18,QAG18,ZWH18";
    observableAssetsTable: Observable<AssetInAssetsTable[]>;
    allAssets:AssetInAssetsTable[];
    forexMajorsAssets:AssetInAssetsTable[];
    forexExoticAssets:AssetInAssetsTable[];
    commoditiesAssets:AssetInAssetsTable[];
    isShowForexMajors=true;
    isShowForexExotic;
    isShowCommodities;
    isShowTable=false;
    isShowExplanation=false;
    
    
  constructor(private assetsService: AssetsService, private assetDataService: AssetDataService) { }

  ngOnInit() {
      
      this.getAssetsTableData(this.symbolsURL);  //the symbols part of the url for http request in asset-data.service
  }
    
    
    
    getAssetsTableData(symbolsInURL:string): void {
    
        this.observableAssetsTable = this.assetDataService.getMultipleAssetsData(symbolsInURL);
        this.observableAssetsTable.subscribe(assetsData => {
            
            this.allAssets = assetsData;
            this.allAssets.map(item=>{this.assetsService.getAsset(item.symbol).then(asset=>{
                
                item.name=asset.nameToShow;     // convert the names to the names I set in assets.service
                
                if(asset.digitsAfterDecimalPoint!=null){
                    item.digitsAfterDecimalPoint=asset.digitsAfterDecimalPoint;
                }else{
                        item.digitsAfterDecimalPoint=2;
                }
                
                item.lowReturn=(100*(item.low-item.previousClose)/item.previousClose).toFixed(2)+'%';
                item.highReturn=(100*(item.high-item.previousClose)/item.previousClose).toFixed(2)+'%';
                item.greenWidth= item.high-item.low>0 ? 100*(item.lastPrice-item.low)/(item.high-item.low) : 100;
                item.redWidth=100-item.greenWidth;
                item.low=item.low.toFixed(item.digitsAfterDecimalPoint);
                item.high=item.high.toFixed(item.digitsAfterDecimalPoint);
                item.open=item.open.toFixed(item.digitsAfterDecimalPoint);
                item.openPriceLeft=100*(item.open-item.low)/(item.high-item.low);
                
                });
            
            });
            
            this.forexMajorsAssets=this.allAssets.slice(0,6);
            this.forexExoticAssets=this.allAssets.slice(6,12);
            this.commoditiesAssets=this.allAssets.slice(12,18);
            
            this.isShowTable=true;
            
         });
            
    }
    
    
    forexMajorsOn():void{
        
            this.isShowForexMajors=true;
            this.isShowForexExotic=false;
            this.isShowCommodities=false;
    }
    
    forexExoticOn():void{
        
            this.isShowForexMajors=false;
            this.isShowForexExotic=true;
            this.isShowCommodities=false;
    }
    
    commoditiesOn():void{
        
            this.isShowForexMajors=false;
            this.isShowForexExotic=false;
            this.isShowCommodities=true;
    }
    
    
    toggleExplanation():void{
       
        if(this.isShowExplanation){
                this.isShowExplanation=false;
            }else{
                this.isShowExplanation=true; 
                }
    } 
    
    closeExplanation(){
        if(this.isShowExplanation){
                this.isShowExplanation=false;
            }
    }
    
 
   
 // the purpose of this method is to check weather the user wants to close the explanation window by just clicking on a random part 
 // of the page. so for every mouse click that is not on the question mark button (that opens the explanation window) or the explanation
 // window itself, we'll close the explanation window. 
   handleClick(event){  
       let clickedComponent = event.target;
       let explanationRelatedClick = false;
       
       do {
           
           if (clickedComponent.id === "questionMarkButton" || clickedComponent.id === "explanationWindow") {
               explanationRelatedClick=true;
               return;
           }
           
           clickedComponent = clickedComponent.parentNode;
           
       } while (clickedComponent);
       
       if(!explanationRelatedClick){
           this.closeExplanation();
        }
      
   }

}
