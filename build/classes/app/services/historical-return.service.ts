import { Injectable } from '@angular/core';
import { AssetData } from '../asset-data'
import { Candlestick } from '../candlestick'
import { Asset } from '../asset'

@Injectable()
export class HistoricalReturnService {

  constructor() { }
    
    
    
    getAssetHistoricDataForWeeks(numberOfWeeks:number, candlestickArr:Candlestick[]):Promise<Candlestick[]>{
        
        let date = new Date();
        let currentMonth=date.getMonth();  // January is 0, February is 1...
        let currentYear=date.getFullYear();
        let baseDay;
        let baseMonth;
        let baseYear=currentYear;
        let indexInArr:number;
        
        let daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
        
                
                baseDay=date.getDate()-7*numberOfWeeks;   // for a weekly check, the day of month should be equal to today minus 7
                
                if(baseDay>0){
                        baseMonth=currentMonth+1;
                }else{
                        baseDay=date.getDate()+daysInMonth[(currentMonth-1+12)%12]-7*numberOfWeeks;   // we need the number of days in last month.. number inside [] represent index...
                        baseMonth=currentMonth>0 ? currentMonth : 12; // need the number to represent a month and not index in array => January is 1
                        baseYear=baseMonth==12 ? baseYear-1 : baseYear; // if baseMonth==12 then we're in the first days of January and a week before would be last year  
                    }
                //console.log(baseDay+","+baseMonth+","+baseYear);
        
                indexInArr=candlestickArr.length-numberOfWeeks*5;   // 5 trading days in a week, times the number of weeks...
                
            
        let indexToSliceArr=this.findTheRightDateIndexInArr(baseDay,baseMonth,baseYear,indexInArr,candlestickArr);
        let arrForPeriod=candlestickArr.slice(indexToSliceArr);
        
        return Promise.resolve(arrForPeriod);
        
        }
    
    
    
    
    
    getAssetHistoricDataForMonths(numberOfMonths:number, candlestickArr:Candlestick[]):Promise<Candlestick[]>{
        
        let date = new Date();
        let currentMonth=date.getMonth();  // January is 0, February is 1...
        let currentYear=date.getFullYear();
        let baseDay;
        let baseMonth=((currentMonth+1-numberOfMonths)+12)%12 > 0 ? ((currentMonth+1-numberOfMonths)+12)%12 : 12;
        let baseYear;       
        let indexInArr:number;
        
        if(currentMonth<numberOfMonths){
            baseYear=currentYear-1;
        }else{
            baseYear=currentYear;
            }
            
        baseDay=date.getDate();                                 // for a monthly check, the day of month should be equal to today
        indexInArr=candlestickArr.length-numberOfMonths*21;   // 21 trading days in a month, times the number of months...
                
        let indexToSliceArr=this.findTheRightDateIndexInArr(baseDay,baseMonth,baseYear,indexInArr,candlestickArr);
        let arrForPeriod=candlestickArr.slice(indexToSliceArr);
        
        return Promise.resolve(arrForPeriod);
    }
    
    
    getAssetHistoricDataForSpecificDate(date,candlestickArr:Candlestick[]):Promise<Candlestick[]>{
        let baseDay = date.substring(8,10);
        let baseMonth = date.substring(5,7);
        let baseYear = date.substring(0,4);
        let indexToSliceArr=this.findTheRightDateIndexInArr(baseDay,baseMonth,baseYear,0,candlestickArr);
        
        let arrForPeriod=candlestickArr.slice(indexToSliceArr);
        
        return Promise.resolve(arrForPeriod);
    }
    
    
    findTheRightDateIndexInArr(baseDay,baseMonth,baseYear,indexToStartSearchingFrom,candlestickArr):number{
        
        let indexInArr=indexToStartSearchingFrom;
        let alreadyWasBigger=false;
        let alreadyWasSmaller=false;
        let alreadyWasInRightMonth=false;
        let alreadyWasInRightYear=false;
        let foundStartingDate=false;
        
        while(!foundStartingDate){
        
            let dayOfTheMonth=candlestickArr[indexInArr].tradingDay.substring(8,10);
            let candleMonth=Number(candlestickArr[indexInArr].tradingDay.substring(5,7));
            let candleYear=candlestickArr[indexInArr].tradingDay.substring(0,4);
            
            //console.log(dayOfTheMonth+","+candleMonth+","+candleYear);
            if(candleYear==baseYear){
                    alreadyWasInRightYear=true;
                    if(candleMonth==baseMonth){
                        alreadyWasInRightMonth=true;
                        if(dayOfTheMonth==baseDay){     // found the right date. calculate the return.
                            //console.log("equal: "+candlestickArr[indexInArr].tradingDay);
                            return indexInArr;
                        }
                        else if(dayOfTheMonth>baseDay){  // go back  a couple of days for the right date.
                                //console.log("bigger: "+candlestickArr[indexInArr].tradingDay);
                                if(alreadyWasSmaller){
                                    //console.log("equal: "+candlestickArr[indexInArr-1].tradingDay);
                                    return indexInArr-1; 
                                }
                                else{
                                    indexInArr--;
                                    alreadyWasBigger=true;
                                }
                         }
                         else{
                             if(alreadyWasBigger){
                                //console.log("equal: "+candlestickArr[indexInArr].tradingDay);
                                return indexInArr; 
                             }
                             else{
                                //console.log("smaller: "+candlestickArr[indexInArr].tradingDay);
                                indexInArr++;
                                alreadyWasSmaller=true;
                             }
                         }
                    }else if(candleMonth<baseMonth){
                        if(alreadyWasInRightMonth){
                            //console.log("equal: "+candlestickArr[indexInArr].tradingDay);
                            return indexInArr; 
                        }
                        else{
                            //console.log("month: go forward");
                            indexInArr++;
                        }
                    }else{
                        if(alreadyWasInRightMonth){
                            //console.log("equal: "+candlestickArr[indexInArr-1].tradingDay);
                            return indexInArr-1; 
                        }
                        else{
                            //console.log("month: keep going back");
                            indexInArr--;
                        }
                    }
            }else {            // go back to the year before. example: we need 11/16 but we're at 01/17.
                if(alreadyWasInRightYear){
                        //console.log("equal: "+candlestickArr[indexInArr-1].tradingDay);
                        return indexInArr-1; 
                }
                else if(candleYear>baseYear){
                    alreadyWasBigger=true;  
                    //console.log("year: keep going back");
                    indexInArr--;
                }
                else{
                    alreadyWasSmaller=true;
                    //console.log("year: keep going forward");
                    indexInArr++;
                }
            }
        }
   }
    
    
    calculateReturnForPeriod(candlestickArr:Candlestick[], price:number, propName?:string, basePrice?:number){
        if(propName == undefined) propName='close';
        if(basePrice == undefined) basePrice=candlestickArr[0][propName]; 
        let returnForPeriod= 100*((price/basePrice)-1);
        return returnForPeriod;
    }
    
    
    calculateLowestPriceForPeriod(candlestickArr:Candlestick[]):number{
        let lowestPrice = 1000000;
        for(let i=0; i<candlestickArr.length; i++){
            if(candlestickArr[i]['low'] < lowestPrice) lowestPrice = candlestickArr[i]['low'];
        }
        return lowestPrice;
    }
    
    
    calculateHighestPriceForPeriod(candlestickArr:Candlestick[]):number{
        let highestPrice = 0;
        for(let i=0; i<candlestickArr.length; i++){
            if(candlestickArr[i]['high'] > highestPrice) highestPrice = candlestickArr[i]['high'];
        }
        return highestPrice;
    }
    
//    calculateReturnForPeriod2(candlestickArr:Candlestick[], lastPrice:number,asset:Asset){
//        
//        let basePrice=candlestickArr[0].close;
//        let multiplier;
//        if(basePrice/lastPrice<5){
//            multiplier=1;
//        }else if(basePrice/lastPrice<50){
//              multiplier=10;
//         }else if(basePrice/lastPrice<500){
//               multiplier=100;
//          }else if(basePrice/lastPrice<5000){
//              multiplier=1000;
//           }else if(basePrice/lastPrice<50000){
//               multiplier=10000;
//            }
//            
//        
//        asset.type=="Currency" || asset.type=="Commodity"  ?  basePrice>130 ? basePrice/=multiplier : basePrice : null;
//        let returnForPeriod= 100*((lastPrice/basePrice)-1);
//        
//        return returnForPeriod;
//        
//        }

}
