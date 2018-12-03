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
    
        
    getSyntheticAssetHistoricData(firstArr, secondArr, relationship):any[]{
        if(firstArr==undefined || secondArr==undefined || firstArr.length != secondArr.length) return;
        if(typeof relationship != 'string' || (relationship != 'divide' && relationship != 'multiply')) return;

        let syntheticAssetHistoricData = [];
        for(let i=0; i<firstArr.length; i++){
            syntheticAssetHistoricData[i] = 
                {'tradingDay':firstArr[i]['tradingDay'], 
                 'close': relationship == 'divide' ? firstArr[i]['close']/secondArr[i]['close'] : firstArr[i]['close']*secondArr[i]['close']
                };
        }
        return syntheticAssetHistoricData;    
    }
        
    adjustArraysBasedOnProp(firstArr, secondArr, prop):boolean {
        if(!(firstArr instanceof Array && secondArr instanceof Array)){
            console.log('Error: problem with getting the data using promise'); 
            return;
        }
        let arrLength , arrLengthUsedInLoop;
        if(firstArr.length < secondArr.length){
            arrLength = firstArr.length;
            arrLengthUsedInLoop = 'first';
        }
        else{
            arrLength = secondArr.length;
            arrLengthUsedInLoop = 'second';
        }
        
        for(let i=0; i<arrLength; i++){
            if(firstArr[i][prop] == secondArr[i][prop]){
                continue;
            }
            else if(firstArr[i][prop] > secondArr[i][prop]){
                secondArr.splice(i,1);
                i--;
                if(arrLengthUsedInLoop == 'second') arrLength--;    // since we just spliced the array, which its length is used to stop the loop
            }
            else{
                firstArr.splice(i,1);
                i--;
                if(arrLengthUsedInLoop == 'first') arrLength--;     // same here 
            }   
        }
        // last check to see if there are still items at the end of the other array (the one which its length wasn't used
        // as the counter in the loop above). if there are, we'll pop them...
        if(arrLengthUsedInLoop == 'first' && secondArr.length > firstArr.length){
            for(let i=firstArr.length; i<secondArr.length; i++){
                secondArr[i].pop();
            }
        }
        else if(arrLengthUsedInLoop == 'second' && firstArr.length > secondArr.length){
            for(let i=secondArr.length; i<firstArr.length; i++){
                firstArr[i].pop();
            }
        }

        if(firstArr.length > 0 && firstArr.length == secondArr.length){ // this check makes sense.
            return true;
        }
        else{
            console.log('Error: the arrays are not equals in size');
            return false;
        }
    }
    
    
    compare(propertyName, isBackwards?:boolean):any{  // for use inside 'sort' function
    
        if(propertyName){
            if(isBackwards){
                return function(a,b){
                   if(typeof a[propertyName] === 'string' && typeof b[propertyName] === 'string'){
                       if (a[propertyName].toLowerCase() > b[propertyName].toLowerCase()) return 1;
                       if (a[propertyName].toLowerCase() < b[propertyName].toLowerCase()) return -1;
                       return 0;
                   }
                   else{
                       if (a[propertyName] > b[propertyName]) return 1;
                       if (a[propertyName] < b[propertyName]) return -1;
                       return 0;
                   }
                }
            }
            else{
                return function(a,b){
                   if(typeof a[propertyName] === 'string' && typeof b[propertyName] === 'string'){
                       if (a[propertyName].toLowerCase() < b[propertyName].toLowerCase()) return 1;
                       if (a[propertyName].toLowerCase() > b[propertyName].toLowerCase()) return -1;
                       return 0;
                   }
                   else{
                       if (a[propertyName] < b[propertyName]) return 1;
                       if (a[propertyName] > b[propertyName]) return -1;
                       return 0;
                   }
                }
            }
        }
    }
    
    
    doOnlyWhen(toDo,toCheck,iterations:number,iterationTime:number,toDoIfFail?){
        
        if(typeof toDo !== 'function' || typeof toCheck !== 'function') return;
        
        let interval = setInterval(function(){
            if(toCheck()){
                clearInterval(interval);
                toDo();
            }
            else if(--iterations==0){
                clearInterval(interval);
                if(toDoIfFail && typeof toDoIfFail === 'function')  toDoIfFail();
            }
        }, iterationTime)
    }
    
    
    printError(errorMessage){
        console.log(errorMessage);
    }
    
    /* mainArr => array of assets which we need to divide to multiple arrays because of the cap on assets in each request */
    /* divider => the number of assets in each request. for now barchart limit the max amount to 25 */
    /* callback => the callback function to call after we divide the main array to sub arrays */
    divideXHRCalls(mainArr:any[],divider:number,callback:Function){
        for(let i=0; i<mainArr.length/divider; i++){
            let subArr = mainArr.slice(divider*i, divider*(i+1));
            callback(subArr);
        }
    }
    
    
    toCamelCase(aString):string{
        let stringArr = aString.toLowerCase().split(' ');
        if(stringArr.length>1){
            for(let i=1; i<stringArr.length; i++){
                let tempArr = stringArr[i].split('');
                tempArr[0] = tempArr[0].toUpperCase();
                stringArr[i] = tempArr.join('');
            }
        }
        return stringArr.join('');
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

    convertHexToRgb(colorInHexFormat: string):any{
        let RGBComponents = colorInHexFormat.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
        if(RGBComponents && RGBComponents.length == 4){
            let rgbObj = {
                r: parseInt(RGBComponents[1], 16),
                g: parseInt(RGBComponents[2], 16),
                b: parseInt(RGBComponents[3], 16)
            }
            return rgbObj;
        }
        else{
            return null;
        }
    }

    convertRgbToHex(r: number, g: number, b: number):string{
        if(Math.floor(r) > 255) r = 255;
        if(Math.floor(g) > 255) g = 255;
        if(Math.floor(b) > 255) b = 255;
        var rHex = Math.floor(r).toString(16).length == 1 ? "0" + Math.floor(r).toString(16) : Math.floor(r).toString(16);
        var gHex = Math.floor(g).toString(16).length == 1 ? "0" + Math.floor(g).toString(16) : Math.floor(g).toString(16);
        var bHex = Math.floor(b).toString(16).length == 1 ? "0" + Math.floor(b).toString(16) : Math.floor(b).toString(16);
        return "#" + rHex + gHex + bHex;
    }
    
    brightenColor(colorInHexFormat: string, multiplier?:number):string{
        if(multiplier == undefined) multiplier = 1;
        let originalColorRGB = this.convertHexToRgb(colorInHexFormat);   // original color as rgb object
        if(!!originalColorRGB){
            let newColorObj = {r:null,g:null,b:null,};
            newColorObj.r = multiplier * originalColorRGB.r;
            newColorObj.g = multiplier * originalColorRGB.g;
            newColorObj.b = multiplier * originalColorRGB.b;
            let newColorStr = this.convertRgbToHex(newColorObj.r, newColorObj.g, newColorObj.b);
            return newColorStr;
        }
        else{
            this.printError("error. color is not in HEX format.");
            return colorInHexFormat;
        } 
    }

}
