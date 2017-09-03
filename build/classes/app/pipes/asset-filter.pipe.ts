import { Pipe, PipeTransform } from '@angular/core';
import { Asset } from '../asset'

@Pipe({
  name: 'assetFilter',
  /*pure: false*/
})
export class AssetFilterPipe implements PipeTransform {

    filteredArray:Asset[];

    
    transform(assets:Asset[], searchedWord: string,isShowList:boolean) {
        
     if(isShowList==false){
         
            return;
            }
    
       
      if(searchedWord==null){
          return;
          }
        
        
        if(searchedWord.length==0){
            return;
            }
           
        
        
        /*We want to screen based on word. If we won't change the word the user types to a word with upper case in the first letter
        ,then when the user will click o he will get Copper and Amazon (both of them have o inside). 
        We don't want him to get anything. If he'll type a, we want him to get Amazon, so we change it to A and because that in the
        array Amazon is written with A at the beginning he'll only get Amazon and not nasdaq100 also.*/
        let firstChar= searchedWord!=null ? searchedWord.substring(0,1).toUpperCase() : null;
        let restOfWord= searchedWord!=null ? searchedWord.substring(1).toLowerCase() :null ;
        searchedWord=firstChar+restOfWord;
        
        this.filteredArray = assets.filter(item=>{
            
            if(item.name.indexOf(searchedWord) !== -1){
                
                return item;   
                 
                }
            
            });
        
        if(this.filteredArray.length==0){
            
            return 
        }else{
            
           return this.filteredArray.sort(compare); /* Sort the array before returning it.  We can also use the method logic inside the sort method like below:
                                                        assets.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);})));*/  
        }
        
        
    }
    
     

}

//  We use this method to sort the array of assets. We put this method as an argument inside assets.sort(compare)
    function compare(a,b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    }

