import { Injectable } from '@angular/core';
import { AssetData } from '../asset-data';
import { Asset } from '../asset';
import { Candlestick } from '../Candlestick';
import { AssetInMarketMoversTable } from '../asset-in-market-movers-table'
import { AssetInAssetsTable } from '../asset-in-assets-table'
import { AssetInRelativePerformance } from '../asset-in-relative-performance'

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
    
    
    
    
    getAssetHistoricData(asset:Asset, timeFrame:string, maxRecords:number): Observable<Candlestick[]> {
        
         if(maxRecords==undefined)  maxRecords=200;
         return this.http.get(this.urlForHistoricAssetData+'&symbol='+asset.symbol+'&type='+timeFrame+'&startDate=20060101&maxRecords='+maxRecords)
            .map(mapAssetHistoricData);
      }
    
    
    getAssetsDataForPerformance(assets:Asset[]): Observable<AssetInMarketMoversTable[]> {
        
       let symbols="";  // if we won't initialize with "" the first asset won't be shown because it's symbol would have "undefined" prefix
        
        for( let i=0 ; i<assets.length ; i++ ){ 
             
            symbols += assets[i].symbol;
             if(i<assets.length-1){
                symbols+=",";
                }
        } 
        
        return this.http.get(this.urlForPresentAssetData+'&symbols='+symbols+'&fields=previousClose%2cpreviousVolume%2csharesOutstanding%2ctwelveMnthPct')
            .map(mapAssetsDataForPerformance);
        
        
     }
    
    
    getMultipleAssetsData(symbolsInURL:string): Observable<any[]> {
        
       let symbols=symbolsInURL;
        
        return this.http.get(this.urlForPresentAssetData+'&symbols='+symbols+'&fields=previousClose')
            .map(mapMultipleAssetsData);
        
     }
    
    getMultipleAssetsData2(symbolsInURL:string): Observable<AssetInRelativePerformance[]> {
        
       let symbols=symbolsInURL;
        
        return this.http.get(this.urlForPresentAssetData+'&symbols='+symbols+'&fields=previousClose%2ctwelveMnthPct')
            .map(mapMultipleAssetsData2);
        
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



function mapAssetHistoricData(res: Response): Candlestick[] {
   
    let result = res.json().results;
    
    let assetHistoricData = result.map(toCandlestick);
    
    return assetHistoricData;
}


function  toCandlestick(result:any): Candlestick{
    
  let candleStick = <any>({

    tradingDay: result.tradingDay, 
    open: result.open,
    low: result.low,
    high: result.high,
    close: result.close,
  
  });
  
      
  return candleStick;
}



function mapAssetsDataForPerformance(res: Response): AssetInMarketMoversTable[] {
   
    let result = res.json().results;
    
    let assetsDataForPerformance = result.map(asset=> {
        
        let assetDataForPerformance = <any> ({
                                            symbol:asset.symbol,
                                            lastPrice: asset.lastPrice,
                                            netChangePercent: (100*(asset.lastPrice-asset.previousClose)/asset.previousClose),
                                            volume: Math.round(asset.volume*asset.lastPrice),
        /* for the market-cap component*/   twelveMnthPct: asset.twelveMnthPct,
        /* for the market-cap component*/   marketCap: asset.sharesOutstanding ? asset.sharesOutstanding*asset.lastPrice/1000000 : null,
        /* for the market-cap component*/   prevMarketCap: asset.sharesOutstanding ? asset.sharesOutstanding*asset.previousClose/1000000 : null,
        /* for the market-cap component*/   lastYearMarketCap: (asset.lastPrice/(1+asset.twelveMnthPct/100))*asset.sharesOutstanding/1000000,
        
                                            })
                                    
                                            return  assetDataForPerformance;
          
                                            });
    return assetsDataForPerformance;
}


function mapMultipleAssetsData(res: Response): any[] {
   
    let result = res.json().results;
    
    let assetData = result.map(asset=> {
        
        let assetData = <any> ({
                                            symbol:asset.symbol,
                                            netChangePercent: (100*(asset.lastPrice-asset.previousClose)/asset.previousClose),
                                            lastPrice: asset.lastPrice,
                                            low: asset.low,
                                            high: asset.high,
                                            previousClose: asset.previousClose,
                                            open: asset.open,
                                            })
                                    
                                            return  assetData;
          
                                            });
    
    return assetData;
    
}

function mapMultipleAssetsData2(res: Response): AssetInRelativePerformance[] {
   
    let result = res.json().results;
    
    let assetData = result.map(asset=> {
        
        let assetData = <any> ({
                                            symbol:asset.symbol,
                                            dayReturn: (100*(asset.lastPrice-asset.previousClose)/asset.previousClose),
                                            lastPrice: asset.lastPrice,
                                            yearReturn: asset.twelveMnthPct,
                                            })
                                    
                                            return  assetData;
          
                                            });
    
    return assetData;
    
}



