import { Component, OnInit,Input } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../assets.service'
import { AssetDataService } from '../asset-data.service'
import { AssetInMarketMoversTable } from '../asset-in-market-movers-table'
import { Observable } from 'rxjs';

@Component({
  selector: 'top-assets-performance',
  templateUrl: './top-assets-performance.component.html',
  styleUrls: ['./top-assets-performance.component.css']
})
export class TopAssetsPerformanceComponent implements OnInit {

    @Input() num;
    assets: Asset[] = [];
    interval;
    observableAssetsDataForPerformance: Observable<AssetInMarketMoversTable[]>; 
    bestPerformingAssets:AssetInMarketMoversTable[];
    worstPerformingAssets:AssetInMarketMoversTable[];
    mostTradedAssets:AssetInMarketMoversTable[];
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService) { }

  ngOnInit() {
      
      this.getAssetsData("Stock");
      
  }
    
 
    getAssetsData(assetType:string): void {
    this.assetsService.getAllAssetsByType(assetType).then(assets => {this.assets=assets;
                                                                     this.getAssetsDataForPerformance(this.assets)
                                                                     this.interval=setInterval(()=>{this.getAssetsDataForPerformance(this.assets)},20000);} );
    }
    
    
    
    
        
        getAssetsDataForPerformance(assets:Asset[]):void{
       
        this.observableAssetsDataForPerformance = this.assetDataService.getAssetsDataForPerformance(assets);
        this.observableAssetsDataForPerformance.subscribe(assetsData => {
            
                
                this.bestPerformingAssets = assetsData.sort(comparePercentChangeHighToLow).slice(0,Number(this.num));
                this.bestPerformingAssets.map(item=>{this.assetsService.getAsset(item.symbol).then(asset=>{item.name=asset.nameToShow})}); // convert the names to the names I set in assets.service
                
                this.worstPerformingAssets = assetsData.sort(comparePercentChangeLowToHigh).slice(0,Number(this.num));
                this.worstPerformingAssets.map(item=>{this.assetsService.getAsset(item.symbol).then(asset=>{item.name=asset.nameToShow})});
            
                this.mostTradedAssets = assetsData.sort(compareVolume).slice(0,Number(this.num));
                this.mostTradedAssets.map(item=>{item.volume=String(item.volume).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                                                this.assetsService.getAsset(item.symbol).then(asset=>{item.name=asset.nameToShow})});
                
                    
                        });
                                                                                 
        }

}



function comparePercentChangeHighToLow(a,b) {
      if (a.netChangePercent < b.netChangePercent)
        return 1;
      if (a.netChangePercent > b.netChangePercent)
        return -1;
      return 0;
    }


function comparePercentChangeLowToHigh(a,b) {
      if (a.netChangePercent > b.netChangePercent)
        return 1;
      if (a.netChangePercent < b.netChangePercent)
        return -1;
      return 0;
    }


function compareVolume(a,b) {
      if (a.volume < b.volume)
        return 1;
      if (a.volume > b.volume)
        return -1;
      return 0;
    }
