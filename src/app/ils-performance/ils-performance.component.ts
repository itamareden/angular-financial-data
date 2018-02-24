import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { UtilsService } from '../services/utils.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'ils-performance',
  templateUrl: './ils-performance.component.html',
  styleUrls: ['./ils-performance.component.css']
})
export class IlsPerformanceComponent implements OnInit {

  
    symbolsURL:string="^USDILS,^EURILS,^GBPILS,^JPYILS,^CHFILS,^AUDILS,^CADILS,^SEKILS,^ZARILS,^PLNILS,^USDMXN,^USDBRL,^USDTRY,^USDCNH,^USDKRW,^NZDUSD";
    observableAssets: Observable<object[]>;
    ilsPairs=[];
    averageDayReturn=0;
    averageYearReturn=0;
    positiveDailyReturn=0;
    positiveYearlyReturn=0;
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private utils: UtilsService) { }

  
    ngOnInit() {
      
      this.getILSPerformanceData(this.symbolsURL);  //the symbols part of the url for http request in asset-data.service
  }
    
    
    
    getILSPerformanceData(symbolsInURL:string): void {
    
        this.observableAssets = this.assetDataService.getMultipleAssetsData2(symbolsInURL);
        this.observableAssets.subscribe(assetsData => {
            
            this.ilsPairs = assetsData;
            
            for(let i=10; i<this.ilsPairs.length; i++){
                let relationship= assetsData[i]['symbol'].indexOf('USD')==1 ? 'divide' : 'multiply';
                let assetName=assetsData[i]['symbol'].substring(1); // get rid of the '^' at the beginning of the symbol
                assetName = assetName.indexOf('USD')==0 ? assetName.substring(3) : assetName.substring(0,3);
                this.ilsPairs[i]=this.utils.getSyntheticAssetData(this.ilsPairs[0],this.ilsPairs[i],relationship,assetsData[i]['symbol'], assetName)    
            }
            
            this.ilsPairs.splice(6,0,this.ilsPairs[this.ilsPairs.length-1]);  // put the NZD after the AUD
            this.ilsPairs.pop();    // remove the NZD from the end of the array
            
            this.averageDayReturn = this.calculateAverageReturn('daily',this.ilsPairs);
            this.averageYearReturn = this.calculateAverageReturn('yearly',this.ilsPairs);
            this.positiveDailyReturn = this.calculatePostiveRetrunRatio('daily',this.ilsPairs);
            this.positiveYearlyReturn = this.calculatePostiveRetrunRatio('yearly',this.ilsPairs);
            
            this.ilsPairs.map(item=>{this.assetsService.getAsset(item.symbol).then(asset=>{
                
                //  the second condition makes sure that the synthetic assets won't be affected
                if(asset!=undefined && asset.nameToShow.indexOf('ILS')>-1){ 
                    item.name=asset.nameToShow.substring(0,3);     // convert the names to the names I set in assets.service
                }
                
                
                });
            
            });
            
            
         });
            
    }
    
    
    calculateAverageReturn(period, dataArr){
        
        let prop;
        let sum=0;
        let average=0;
        
        if(period=='daily'){
            prop='dayReturn';
        }else if(period=='yearly'){
            prop='yearReturn';   
        }
        
        for(let i=0; i<dataArr.length; i++){
            sum+=dataArr[i][prop];
        }
        average=sum/dataArr.length
        
        return average;
    }
    
    calculatePostiveRetrunRatio(period, dataArr){
        
        let positiveRatioCounter=0;
        let positiveRatio=0;
        let prop;
        
        if(period=='daily'){
            prop='dayReturn';
        }else if(period=='yearly'){
            prop='yearReturn';   
        }
        
        for(let i=0; i<dataArr.length; i++){
            dataArr[i][prop]>0 ? positiveRatioCounter++ : null;
        }
        
        positiveRatio=100*positiveRatioCounter/dataArr.length;
        
        return positiveRatio;
    }

}
