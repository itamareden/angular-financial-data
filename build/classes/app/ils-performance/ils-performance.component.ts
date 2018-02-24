import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'ils-performance',
  templateUrl: './ils-performance.component.html',
  styleUrls: ['./ils-performance.component.css']
})
export class IlsPerformanceComponent implements OnInit {

  
    symbolsURL:string="^USDILS,^EURILS,^GBPILS,^JPYILS,^CHFILS,^AUDILS,^NZDILS,^CADILS,^SEKILS,^ZARILS,^MXNILS,^BRLILS,^TRYILS,^PLNILS,^CHNILS";
    observableAssets: Observable<object[]>;
    ilsPairs=[];
    averageDayReturn=0;
    averageYearReturn=0;
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService) { }

  
    ngOnInit() {
      
      this.getAssetsTableData(this.symbolsURL);  //the symbols part of the url for http request in asset-data.service
  }
    
    
    
    getAssetsTableData(symbolsInURL:string): void {
    
        this.observableAssets = this.assetDataService.getMultipleAssetsData2(symbolsInURL);
        this.observableAssets.subscribe(assetsData => {
            
            this.ilsPairs = assetsData;
            this.averageDayReturn = this.calculateAverageReturn('daily',this.ilsPairs);
            this.averageYearReturn = this.calculateAverageReturn('yearly',this.ilsPairs);
            
            this.ilsPairs.map(item=>{this.assetsService.getAsset(item.symbol).then(asset=>{
                
                item.name=asset.nameToShow.substring(0,3);     // convert the names to the names I set in assets.service
                
                
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

}
