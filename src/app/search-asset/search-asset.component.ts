import { Component, OnInit } from '@angular/core';
import { Asset } from '../asset'
import { AssetsService } from '../assets.service'

import { Observable } from 'rxjs';


@Component({
  selector: 'search-asset',
  templateUrl: './search-asset.component.html',
  styleUrls: ['./search-asset.component.css'],
})
export class SearchAssetComponent implements OnInit {
    
    assets: Asset[] = [];  
    isSelected:boolean;
    counter:number;
    assetTyped:string;
    isShowList:boolean;
        
  constructor(private assetsService: AssetsService) { }
  


  ngOnInit() {
      
      this.getAllAssets();
      
  }
    
    
    getAllAssets(): void {
    this.assetsService.getAllAssets().then(assets => this.assets = assets);
  }
    

    
    onFocus(){      /* Activate the search box so when user enter letters he will see results*/
        
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
            
}
