import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssetsService } from '../services/assets.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'assets-menu-modal',
  templateUrl: './assets-menu-modal.component.html',
  styleUrls: ['./assets-menu-modal.component.css'],
  outputs:['onContinueButtonClick']
})
export class AssetsMenuModalComponent implements OnInit {
        
    specialAssets = ['Stock Indexes','FAANG','Currencies','Commodities']
    assetsToSelect = [];
    selectedAssets = [];
    assetTyped:string;
    isShowModal;
    isButtonEnabled = false;
    screenHeight;
    screenWidth;
    
    @Output() onContinueButtonClick = new EventEmitter();

    constructor(private assetsService: AssetsService, private utils: UtilsService) { }

    ngOnInit() {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        let assets = this.assetsService.getAllVisibleAssets().sort(this.utils.compare('nameToShow',true));
        for(let i=0; i<assets.length; i++){
            let assetObj = {
                assetData:assets[i],
                isRemove:false    
            }
            this.assetsToSelect.push(assetObj);
        }
    }

    
    selectOrUnselectAsset(asset){
        if(asset['isRemove']) asset['isRemove'] = false;
        else asset['isRemove'] = true;
    }


    addAssetsToList(){  // to selected assets list..
        let arrLength = this.assetsToSelect.length; 
        for(let i=0; i<arrLength; i++){
            if(this.assetsToSelect[i].isRemove){
                this.assetsToSelect[i].isRemove = false;
                this.selectedAssets.push(this.assetsToSelect[i]);
                this.assetsToSelect.splice(i,1);     // remove from list..
                arrLength--;
                i--;   
            }
        }
        this.checkContinueButtonStatus();
    }


    removeAssetsFromList(){   // from selected assets list..
        let arrLength = this.selectedAssets.length; 
        for(let i=0; i<arrLength; i++){
            if(this.selectedAssets[i].isRemove){
                this.selectedAssets[i].isRemove = false;
                this.assetsToSelect.push(this.selectedAssets[i]);
                this.selectedAssets.splice(i,1);     // remove from list..
                arrLength--;
                i--;   
            }
        }
        this.assetsToSelect.sort(this.compare()); 
        this.checkContinueButtonStatus();
    }
    
    checkContinueButtonStatus(){
        if(this.selectedAssets.length >= 2 && this.selectedAssets.length <= 9){
            this.isButtonEnabled = true;
        } 
        else if(this.selectedAssets.length == 1){
            let assetName = this.selectedAssets[0]['assetData']['name'];
            if(this.specialAssets.indexOf(assetName) > -1){
                this.isButtonEnabled = true;
            }
            else{
                this.isButtonEnabled = false;
            }
        }
        else{
            this.isButtonEnabled = false;
        }
    }
    
    passAssetsToParent(): void {
         this.onContinueButtonClick.emit({
             value: this.selectedAssets
         });
    }
    
    closeModal(){
        this.isShowModal = false;
        this.assetTyped = '';   // clear the input field
    }
    
    saveAssets(){
        this.passAssetsToParent();
        this.closeModal();
    }
    
    compare(){
        return function(a,b){
                   if (a['assetData']['nameToShow'].toLowerCase() > b['assetData']['nameToShow'].toLowerCase()) return 1;
                   if (a['assetData']['nameToShow'].toLowerCase() < b['assetData']['nameToShow'].toLowerCase()) return -1;
                   return 0;
               }
    }

}
