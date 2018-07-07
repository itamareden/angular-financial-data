import { Injectable } from '@angular/core';
import { AssetData } from '../asset-data';
import { Asset } from '../asset';
import { Candlestick } from '../Candlestick';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


let digitsAfterDecimalPoint;


@Injectable()
export class AssetDataService {

    
    urlForProxy:string='https://cors-anywhere.herokuapp.com/';   // for overcoming CORS issues
    key:string='24bead7b883216bccdf756c20982808c'
    urlForPresentAssetData:string=this.urlForProxy+'http://marketdata.websol.barchart.com/getQuote.json?key='+this.key;
    urlForHistoricAssetData:string=this.urlForProxy+'http://marketdata.websol.barchart.com/getHistory.json?key='+this.key;
    regularFields:string='fiftyTwoWkHigh%2CfiftyTwoWkLow%2CpreviousClose%2CtwelveMnthPct%2ctwentyDayAvgVol';
    extraFieldsForStock:string="sharesOutstanding%2CdividendYieldAnnual";
    extraFieldsForFuture:string="impliedVolatility%2cexpirationDate%2copenInterest";
    
    
  constructor(private http : Http) { }
    
    
    
    

    getAssetData(asset:Asset): Observable<AssetData> {
         
         if(asset.digitsAfterDecimalPoint==null){
             
           digitsAfterDecimalPoint=2;  
             
             }else{
             
                 digitsAfterDecimalPoint=asset.digitsAfterDecimalPoint;  
               
             }
         
         let fields=this.regularFields; // For currencies, gold, silver...
         
         if(asset.type=="Stock"){
             
             fields+="%2c"+this.extraFieldsForStock;
             
          }else if(asset.type.substring(0,6)=="Future") {
             
             fields+="%2c"+this.extraFieldsForFuture;
             
             }
        
         return this.http.get(this.urlForPresentAssetData+'&symbols='+asset.symbol+'&fields='+fields)
            .map(mapAssetData);
      }
    
    
    
    
    getAssetHistoricData(asset:any, timeFrame?:string, maxRecords?:number): Observable<Candlestick[]> {
        
        
        let assetSymbol='';
        if(maxRecords == undefined)  maxRecords = 200;
        if(timeFrame == undefined) timeFrame = 'daily';
        if(typeof asset == 'object' && asset.symbol){
            assetSymbol = asset.symbol;
        }
        else if(typeof asset == 'string'){
            assetSymbol = asset;
        } 
        else{
            console.log('asset should be of type Asset or string');
            return;
        }
        return this.http.get(this.urlForHistoricAssetData+'&symbol='+assetSymbol+'&type='+timeFrame+'&startDate=20060101&maxRecords='+maxRecords)
           .map(mapAssetHistoricData);
    } 
    
    
    
    getMultipleAssetsData(assetsSymbols:any, componentName?:string, extraFields?:[string]): Observable<any> {
        
        let symbols='';  // must initialize...
        let fields='';
        
        if(typeof assetsSymbols == 'object' && assetsSymbols instanceof Array){
            for( let i=0 ; i<assetsSymbols.length ; i++ ){ 
            // check if the array consists of string or objects.
                typeof assetsSymbols[i] == 'object' ? symbols += assetsSymbols[i].symbol : symbols += assetsSymbols[i];
                if(i<assetsSymbols.length-1){
                   symbols+=",";
                }
            } 
        }
        else if(typeof assetsSymbols == 'string'){
            symbols = assetsSymbols;
        }
        else{
            console.log('cannot get assets data. assetsSymbols should be of type string or array.');
            return;   
        }
        
        if(extraFields && extraFields.length>0){
            for( let i=0 ; i<extraFields.length ; i++ ){ 
                fields += extraFields[i];
                if(i<extraFields.length-1){
                   fields+="%2c";
                }
            }
        }
        
        return this.http.get(this.urlForPresentAssetData+'&symbols='+symbols+'&fields=previousClose%2c'+fields)
            .map(Response => {return Response.json()['results']})   // results is an array of objects from barchart..
            .map(function(assetsArr){return mapMultipleAssetsData(assetsArr,componentName)});
            
    }
    
    
    
    getHistoricalDataForMultipleAssets(assetsSymbols:[string],timeFrame?:string, maxRecords?:number):Promise<any>{
        
        let arrayToReturn=[];
        for(let i=0; i<assetsSymbols.length; i++){
            let observable:Observable<any[]>;
            observable = this.getAssetHistoricData(assetsSymbols[i],timeFrame,maxRecords); 
            observable.subscribe(candlesticks => arrayToReturn[i]=candlesticks);           
        }

        let promise = new Promise(function(resolve) {
             let interval = window.setInterval(function() {
                 if(arrayToReturn.length == assetsSymbols.length){
                                    clearInterval(interval);
                                    setTimeout(function(){
                                        resolve(arrayToReturn);
                                    },500);
                 }
             },500);
        });
        
        return promise;
    }
    

}



function mapAssetData(res: Response): any {
    
    let result = res.json().results;
    
    let assetData = <any> ({
    
    startTime: result[0].tradeTimestamp.toString(), 
    open: result[0].open.toFixed(digitsAfterDecimalPoint).toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,"),
    low: result[0].low.toFixed(digitsAfterDecimalPoint).toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,"),
    high: result[0].high.toFixed(digitsAfterDecimalPoint).toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,"),
    lastPrice: result[0].lastPrice.toFixed(digitsAfterDecimalPoint).toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,"),
    lastPriceAsNumber: result[0].lastPrice,
    netChange: (result[0].lastPrice-result[0].previousClose).toFixed(digitsAfterDecimalPoint),
    netChangePercent: (100*(result[0].lastPrice-result[0].previousClose)/result[0].previousClose),
    volume: result[0].volume.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
    monthlyAverageVolume: result[0].twentyDayAvgVol.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
    previousClose: result[0].previousClose.toFixed(digitsAfterDecimalPoint).toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,"),
    fiftyTwoWkHigh: result[0].fiftyTwoWkHigh<this.high ? this.high : result[0].fiftyTwoWkHigh.toFixed(digitsAfterDecimalPoint).toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,"),
    fiftyTwoWkLow:  result[0].fiftyTwoWkLow>this.low ? this.low : result[0].fiftyTwoWkLow.toFixed(digitsAfterDecimalPoint).toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,"),
    twelveMnthPct: result[0].twelveMnthPct.toFixed(2),
  });
    
    // Extra for stocks..
    result[0].sharesOutstanding ?  assetData.marketCap = (result[0].sharesOutstanding*result[0].lastPrice/1000000).toFixed(2) : null;
    result[0].dividendYieldAnnual ? assetData.dividendYieldAnnual = result[0].dividendYieldAnnual : null;
    
    // Extra for futures..
    result[0].impliedVolatility ? assetData.impliedVolatility = result[0].impliedVolatility : null;
    result[0].expirationDate ? assetData.expirationDate = result[0].expirationDate : null;
    result[0].openInterest ? assetData.openInterest = result[0].openInterest.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : null;
    

    return assetData;
}



function mapAssetHistoricData(res: Response): any[] {
   
    let result = res.json().results;
    
    let assetHistoricData = result.map(toCandlestick);
    
    return assetHistoricData;
}


function  toCandlestick(result:any): any{
    
  let candleStick = <any>({

    tradingDay: result.tradingDay, 
    open: result.open,
    low: result.low,
    high: result.high,
    close: result.close,
  
  });
  
      
  return candleStick;
}




function mapMultipleAssetsData(assetsArr,componentName){
    let assetsData = assetsArr.map(asset=> {
        let assetData = <any> ({
                symbol:asset.symbol,
                lastPrice: asset.lastPrice,
                low: asset.low,
                high: asset.high,
                open: asset.open,
                previousClose: asset.previousClose,
                netChangePercent: (100*(asset.lastPrice-asset.previousClose)/asset.previousClose),
            })
        
        if(componentName=='top-assets-performance' || componentName == 'market-cap'){
            // check if the first item in the array has the property. if so then all of the other items also have it...
           assetsArr[0]['volume'] ? assetData.volume = Math.round(asset.volume*asset.lastPrice) : null; 
           assetsArr[0]['fiftyTwoWkHigh'] ?  assetData.yearRecordHigh = asset.fiftyTwoWkHigh : null;
           assetsArr[0]['fiftyTwoWkLow'] ? assetData.yearRecordLow = asset.fiftyTwoWkLow : null;
           assetsArr[0]['sharesOutstanding'] && assetsArr[0]['twelveMnthPct'] ?  
                        (assetData.twelveMnthPct = asset.twelveMnthPct,
                         assetData.marketCap = asset.sharesOutstanding*asset.lastPrice/1000000,
                         assetData.prevMarketCap = asset.sharesOutstanding*asset.previousClose/1000000,
                         assetData.lastYearMarketCap = (asset.lastPrice/(1+asset.twelveMnthPct/100))*asset.sharesOutstanding/1000000
                        ) : null;
            
        }
        else if(componentName == 'gold-ratio'){
           assetsArr[0]['twelveMnthPct'] ? assetData.yearReturn=asset.twelveMnthPct : null;
        }
        else if(componentName == 'ils-performance'){
           assetData.dayReturn=assetData.netChangePercent;
           assetsArr[0]['twelveMnthPct'] ? assetData.yearReturn=asset.twelveMnthPct : null;
        }
        else if(componentName == 'relative-performance'){
           assetData.dayReturn=assetData.netChangePercent;
           assetsArr[0]['twelveMnthPct'] ? assetData.yearReturn=asset.twelveMnthPct : null;
           assetsArr[0]['fiftyTwoWkHigh'] ?  assetData.fiftyTwoWkHigh = asset.fiftyTwoWkHigh : null;
           assetsArr[0]['fiftyTwoWkLow'] ? assetData.fiftyTwoWkLow = asset.fiftyTwoWkLow : null; 
        }
        else if(componentName == 'stock-statistics'){
           assetData.dayReturn=assetData.netChangePercent;
           assetData.lowInPerc = (100*(asset.low-asset.previousClose)/asset.previousClose);
           assetData.highInPerc = (100*(asset.high-asset.previousClose)/asset.previousClose);
           assetsArr[0]['twelveMnthPct'] ? assetData.yearReturn=asset.twelveMnthPct : null;
        }
        
        return  assetData;
        });
    
     return assetsData;
}

