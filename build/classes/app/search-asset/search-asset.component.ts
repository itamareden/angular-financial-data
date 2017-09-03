import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
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
    
    assets: Asset[] = [];  
    isSelected:boolean;
    counter:number;
    assetTyped:string;
    isShowList:boolean;
    placeHolder:string="Start typing asset name";
    rowInList=0;
    scrollDown=0;   // position of the auto scroll
        
  constructor(private assetsService: AssetsService) { }
  


  ngOnInit() {
      
      this.getAllAssets();
      
  }
    
    
    getAllAssets(): void {
    this.assetsService.getAllAssets().then(assets => this.assets = assets);
  }
    

    
    onFocus(){      /* Activate the search box so when user enter letters he will see results*/
        
        this.placeHolder="";
        this.isShowList=true;
        
        return  this.isShowList;
        }
    
    
    
    clear(){        /*clear the search box if the user clicked on empty space (the input's | will stop blinking)*/
    
        setTimeout(() => {
            
            this.isShowList = false;
            
            if(this.isSelected==true){
                
                /*  clear the input field after user picked an asset */
                this.assetTyped='';
                this.isSelected=false;
                
                }

            return this.isShowList;
            }, 200);
    
        
        
        
        return this.isShowList;
          
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
                 }else if(hovered.nextElementSibling != null){
                        hovered.classList.remove('hovered');
                        hovered.nextElementSibling.classList.add('hovered');
                        this.rowInList++;
                        this.rowInList-6==this.scrollDown ? (list.scrollTop+=68.4,this.scrollDown++) : null;
                  }
            
        }else if(key == "ArrowUp"){
                
                if(hovered!=null && hovered.previousElementSibling!=null){ 
                    hovered.classList.remove('hovered'); 
                    hovered.previousElementSibling.classList.add('hovered');
                    this.rowInList--;
                    this.rowInList==this.scrollDown ? (list.scrollTop-=68.4,this.scrollDown--) : null;
                    
                    }
            
                event.preventDefault();  // to prevent the text cursor from going to the left of the text
            
        }else if(key == "Enter"){
                hovered!=null ? (hovered.click(),this.input.nativeElement.blur(),this.rowInList=0,this.scrollDown=0) : null;
        }
    }
            
}
