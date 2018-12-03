import { Component, OnInit,Input } from '@angular/core';
import { Asset } from '../asset'
import { AssetData } from '../asset-data'
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { UtilsService } from '../services/utils.service';

import { Observable } from 'rxjs';


@Component({
  selector: 'top-assets-performance',
  templateUrl: './top-assets-performance.component.html',
  styleUrls: ['./top-assets-performance.component.css']
})
    
   
    
    
export class TopAssetsPerformanceComponent implements OnInit { 

    @Input() num;
    assets: Asset[] = [];
    static assetsData = [];
    interval;
    observable: Observable<any[]>; 
    bestPerformingAssets = [];
    worstPerformingAssets = [];
    mostActiveAssets = [];
    isShowBestPerforming=true;
    isShowWorstPerforming;
    isShowMostActive;
    isShowComponent;
    
    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private utils: UtilsService) { }

    ngOnInit() {
        this.getAssetsData("Stock");
        this.utils.doOnlyWhen(function(){
                this.calculatePerformance(TopAssetsPerformanceComponent.assetsData);
            }.bind(this), function(){
                return !!(TopAssetsPerformanceComponent.assetsData.length > 75)}, 
            30, 800, function(){console.log('got data for less than 75 assets')});
          
    }
    
    ngOnDestroy(){
        TopAssetsPerformanceComponent.assetsData=[];
    }
    
    getAssetsData(assetType:string): void {
        this.assetsService.getAllVisibleAssetsByType(assetType).then(assets => {
            this.utils.divideXHRCalls(assets,25,this.getAssetsDataForPerformance.bind(this));
        });
    }
    
    getAssetsDataForPerformance(assets:Asset[]):void{
        this.observable = this.assetDataService.getMultipleAssetsData(assets,'top-assets-performance',['previousVolume','sharesOutstanding','twelveMnthPct','fiftyTwoWkHigh','fiftyTwoWkLow']);    
        this.observable.subscribe(assetsData => {
            for(let i=0; i<assetsData.length; i++){
                if(!!assetsData[i].lastPrice){
                    TopAssetsPerformanceComponent.assetsData.push(assetsData[i]);                    
                }
            }
        });
    }
    
    calculatePerformance(assetsData:any[]){
           this.bestPerformingAssets = assetsData.sort(comparePercentChangeHighToLow).slice(0,Number(this.num));
           this.bestPerformingAssets.map(item=>{this.assetsService.getAsset(item.symbol).then(asset=>{
                    item.name=asset.nameToShow;     // convert the names to the names I set in assets.service
                    if(asset.DADP!=null){
                        item.DADP=asset.DADP;
                    }
                    else{
                        item.DADP=2;
                    }
                });
            }); 
            this.worstPerformingAssets = assetsData.sort(comparePercentChangeLowToHigh).slice(0,Number(this.num));
            this.worstPerformingAssets.map(item => {this.assetsService.getAsset(item.symbol).then(asset => {
                    item.name=asset.nameToShow;
                    if(asset.DADP!=null){
                        item.DADP=asset.DADP;
                    }
                    else{
                        item.DADP=2;
                    }
                });
            });
            this.mostActiveAssets = assetsData.sort(compareVolume).slice(0,Number(this.num));
            this.mostActiveAssets.map(item=>{
                if(item.volume>1000000000){
                    item.volume=item.volume/1000000000;
                    item.volumeNotation = "B";  // M for millions , B for billions
                }
                else{
                    item.volume=item.volume/1000000;
                    item.volumeNotation = "M";
                }
                this.assetsService.getAsset(item.symbol).then(asset=>{
                    item.name=asset.nameToShow;
                    if(asset.DADP!=null){
                        item.DADP=asset.DADP;
                    }
                    else{
                        item.DADP=2;
                    }
                });
            });
            this.isShowComponent=true;  // show component only after it has data to show. 
    }
    
    
    bestPerformingOn():void{
        this.isShowBestPerforming =true;
        this.isShowWorstPerforming =false;
        this.isShowMostActive =false;
     }
    
    
    worstPerformingOn():void{
        this.isShowWorstPerforming =true;
        this.isShowBestPerforming =false;
        this.isShowMostActive =false;
     }
    
    
    mostActiveOn():void{
        this.isShowMostActive =true;
        this.isShowBestPerforming =false;
        this.isShowWorstPerforming =false;
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


