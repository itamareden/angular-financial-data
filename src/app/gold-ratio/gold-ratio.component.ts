import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { UtilsService } from '../services/utils.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-gold-ratio',
  templateUrl: './gold-ratio.component.html',
  styleUrls: ['./gold-ratio.component.css']
})
export class GoldRatioComponent implements OnInit {

    
    symbolsURL:string="^XAUUSD,^XAGUSD";
    observableAssets: Observable<object[]>;
    metals=[];  // gold and silver
    goldRatio={
        dayReturn: 0,
        yearReturn: 0,
        lastPrice:0
        };
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private utils: UtilsService) { }

  
    ngOnInit() {
      
      this.getGoldRatioData(this.symbolsURL);  //the symbols part of the url for http request in asset-data.service
  }
    
    
    
    getGoldRatioData(symbolsInURL:string): void {
    
        this.observableAssets = this.assetDataService.getMultipleAssetsData2(symbolsInURL);
        this.observableAssets.subscribe(assetsData => {
            
            this.metals = assetsData;
            
            this.goldRatio=this.utils.getSyntheticAssetData(this.metals[0],this.metals[1],'divide','^XAUUSD', 'Gold/Silver Ratio')    
            
         });
            
    }

}
