import { Component, OnInit, ViewChild,ElementRef, Input, HostListener } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../services/assets.service';

import { Observable } from 'rxjs';


@Component({
  selector: 'search-asset',
  templateUrl: './search-asset.component.html',
  styleUrls: ['./search-asset.component.css'],
})
export class SearchAssetComponent implements OnInit {
        
    
    @ViewChild('input') input:ElementRef;
    @Input() placeHolder;
    @Input() disableRouting:boolean;
    
    assets: Asset[] = []; 
    assetsNames:string[]=[];
    selectedAsset:Asset; 
    isSelected:boolean;
    counter:number;
    assetTyped:string;
    priorAssetTyped:string;
    isShowList:boolean;
    rowInList=0;
    scrollDown=0;   // position of the auto scroll
        
  constructor(private assetsService: AssetsService) { }
  


  ngOnInit() {
      
      if(this.placeHolder==null){
        this.placeHolder="Start typing asset name";          
      }
      
      this.getAllAssets();
      
  }
    
    
    getAllAssets(): void {
    this.assetsService.getAllAssets().then(assets => {
             this.assets = assets;
            // for the condition inside clear method.. to see if assetTyped value (whether fully typed or chosen) is an asset name 
             assets.map(asset=>{let assetName=asset.nameToShow; this.assetsNames.push(assetName);})
        });
  }
    

    
    onFocus(){      /* Activate the search box so when user enter letters he will see results*/
        
        this.isShowList=true;
    }
    
    
    
    clearDelayed(){        /*clear the search box if the user clicked on empty space (the input's | will stop blinking)*/
        
        setTimeout(() => {
            
            this.priorAssetTyped=undefined;
            this.isShowList=false;
            
            if(!this.disableRouting || this.assetsNames.indexOf(this.assetTyped) == -1){
                this.assetTyped='';
            }
            
            }, 200);
          
        }
    
    
    clear(){        /*clear the search box if the user clicked on empty space (the input's | will stop blinking)*/
        
            this.priorAssetTyped=undefined;
            this.isShowList=false;
            
            if(this.assetsNames.indexOf(this.assetTyped) == -1){
                this.assetTyped='';
            }
            
        }
    
    
    chooseAssetWithKeyboard(event,list){
        
        let key = event.key;
        let listRows=list.children.length;
        
        let hovered=<HTMLElement>document.getElementsByClassName('hovered')[0];
        if (key == "ArrowDown") {
             
                if(hovered==null){
                        listRows>0 ? hovered=list.firstElementChild.classList.add('hovered') : null;
                        this.rowInList=1;
                        this.scrollDown=0;  // if user type more (from "c" to "co") or delete (from "c" to none) we need to start over
                        this.priorAssetTyped=this.assetTyped;
                        list.firstElementChild!= null ? this.assetTyped=list.firstElementChild.getElementsByTagName('P')[0].textContent : null;
                 }else if(hovered.nextElementSibling != null){
                        hovered.classList.remove('hovered');
                        hovered.nextElementSibling.classList.add('hovered');
                        this.assetTyped=hovered.nextElementSibling.getElementsByTagName('P')[0].textContent;
                        this.rowInList++;
                        this.rowInList-6==this.scrollDown ? (list.scrollTop+=68.4,this.scrollDown++) : null;
                  }
            
        }else if(key == "ArrowUp"){
                
                if(hovered!=null && hovered.previousElementSibling!=null){ 
                    hovered.classList.remove('hovered'); 
                    hovered.previousElementSibling.classList.add('hovered');
                    this.rowInList--;
                    this.rowInList==this.scrollDown ? (list.scrollTop-=68.4,this.scrollDown--) : null;
                    this.assetTyped=hovered.previousElementSibling.getElementsByTagName('P')[0].textContent;   
                 }
            
                event.preventDefault();  // to prevent the text cursor from going to the left of the text
            
        }else if(key == "Enter" || key == "Tab"){  // tab is like enter.. it enables you to choose and move to next button/input
                hovered!=null ? (hovered.click(),this.input.nativeElement.blur(),this.rowInList=0,this.scrollDown=0) : null;
                this.priorAssetTyped=undefined;
        }else{
                this.priorAssetTyped=undefined;     // for the pipe to resume working with assetTyped and not priorAssetTyped...
        }
    }
    
    
    
    assetSelected(asset){
        this.selectedAsset=asset;
        this.assetTyped=this.selectedAsset.nameToShow;
        this.isShowList=false;
    }
    
    selectAsset(){
        this.isSelected=true;
        this.isShowList=false;
    }
    
            
}
