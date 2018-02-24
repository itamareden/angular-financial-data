import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() { }
    
    
    getSyntheticAssetData(firstAsset, secondAsset, relationship, assetSymbol, assetName): any{
        
        if(firstAsset==undefined || secondAsset==undefined) return null;
        if(typeof relationship != 'string' || (relationship != 'divide' && relationship != 'multiply')) return null;
        if(assetName==undefined || typeof assetName != 'string') return null;
        
        let syntheticAsset={
            symbol: assetSymbol!= undefined ? assetSymbol :null,
            name: assetName,  
            lastPrice: null,
            previousClose: null,
            dayReturn: null,
            yearReturn: null,
        
        };
        
        let firstAssetLastYearClose=firstAsset.lastPrice/(1+firstAsset.yearReturn/100);
        let secondAssetLastYearClose=secondAsset.lastPrice/(1+secondAsset.yearReturn/100);
        
        
        if(relationship=='divide'){
            syntheticAsset.lastPrice=firstAsset.lastPrice/secondAsset.lastPrice;
            syntheticAsset.previousClose=firstAsset.previousClose/secondAsset.previousClose;  
            syntheticAsset.dayReturn=100*(syntheticAsset.lastPrice/syntheticAsset.previousClose-1);
            let syntheticAssetLastYearClose=firstAssetLastYearClose/secondAssetLastYearClose;
            syntheticAsset.yearReturn=100*(syntheticAsset.lastPrice/syntheticAssetLastYearClose-1);
        }else{
            syntheticAsset.lastPrice=firstAsset.lastPrice*secondAsset.lastPrice;
            syntheticAsset.previousClose=firstAsset.previousClose*secondAsset.previousClose;  
            syntheticAsset.dayReturn=100*(syntheticAsset.lastPrice/syntheticAsset.previousClose-1);
            let syntheticAssetLastYearClose=firstAssetLastYearClose*secondAssetLastYearClose;
            syntheticAsset.yearReturn=100*(syntheticAsset.lastPrice/syntheticAssetLastYearClose-1);
        }
        
        return syntheticAsset;
        
    }
    
    
    
    
    compareAssetsBasedOnProp(propertyName):any{
    
        if(propertyName){
           return function(a,b){
    
               if (a[propertyName] < b[propertyName])
                  return 1;
               if (a[propertyName] > b[propertyName])
                  return -1;
               return 0;
            }
        }
    }
    
    
    roundDownLastDigitAfterDecimalPoint(num:number, digitsAfterDecimalPoint:number):number{    // for example: 0.8117 => 0.8110 , 2.41 => 2.40 and so on..
        
        let numWithoutDecimal = this.getRidOfNumberDecimals(num, digitsAfterDecimalPoint);  // 0.8117 => 8117
        if(numWithoutDecimal%10==0) return num;
        let roundedNum = (numWithoutDecimal - numWithoutDecimal%10)/Math.pow(10, digitsAfterDecimalPoint);  // 8117 => 0.8110
        
        return roundedNum;
    }
    
    getRidOfNumberDecimals(num:number, digitsAfterDecimalPoint:number){
        let numWithoutDecimal = Math.pow(10, digitsAfterDecimalPoint)*num;  // 0.8117 => 8117
        return numWithoutDecimal;
    }
    
    
    turnLastDigitOfIntegerIntoZero(num:number){    // for example: 8117 => 8110 , 241 => 240 and so on..
    
        if(this.isInteger(num)){
            if(num%10==0) return num;
            num = (num - num%10);  // 8117 => 8110
            
            return num;
        }
    }
    
    isInteger(num:number){
        if((10*num)%10==0) return true;
        else return false;
    }
    
    calculateModuloSafely(dividend: number,divisor: number):number{ // to overcome javascript inability to deal with floating numbers
        
        let multiplyCounter=0;
        while(!this.isInteger(dividend) || !this.isInteger(divisor)){
            dividend*=10;
            divisor*=10;
            multiplyCounter++;   
        }
        if(multiplyCounter==0) return dividend%divisor;
        else return (dividend%divisor)/(10*multiplyCounter);
    }

}
