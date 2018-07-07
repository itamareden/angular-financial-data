import { Pipe, PipeTransform } from '@angular/core';
import { Asset } from '../asset'

@Pipe({
  name: 'assetsListFilter',
  pure: false,  /*  makes it sensitive to changes of the list when it is filtered   */
})
export class AssetsListFilterPipe implements PipeTransform {
        
    filteredArray:Asset[];

    transform(assets:Asset[], searchedWord: string): any {
        if(!searchedWord) return assets;
        this.filteredArray = assets.filter(item=>{
                if(item['assetData']['nameToShow'].toLowerCase().indexOf(searchedWord) !== -1){
                    return item;   
                }
            });
        return this.filteredArray;
    }
    

}

