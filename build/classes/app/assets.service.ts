import { Injectable } from '@angular/core';
import { Asset } from './asset';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


const ASSETS : Asset[] = [
        { "id":1, "symbol":"IBM", "name":"Ibm", "nameToShow":"IBM", "type":"Stock" },
        { "id":2, "symbol":"INTC", "name":"Intel", "nameToShow":"Intel", "type":"Stock" },
        { "id":3, "symbol":"AAPL", "name":"Apple", "nameToShow":"Apple", "type":"Stock" },
        { "id":4, "symbol":"AMZN", "name":"Amazon", "nameToShow":"Amazon", "type":"Stock" },
        { "id":5, "symbol":"^XAGUSD", "name":"Silver", "nameToShow":"Silver", "type":"Commodity" },
        { "id":6, "symbol":"^XAUUSD", "name":"Gold", "nameToShow":"Gold", "type":"Commodity" },
        { "id":7, "symbol":"HGN17", "name":"Copper", "nameToShow":"Copper", "type":"Commodity", "digitsAfterDecimalPoint":3 },
        { "id":8, "symbol":"CLQ17", "name":"Crude oil", "nameToShow":"Crude oil", "type":"Commodity" },
        { "id":9, "symbol":"NQU17", "name":"Nasdaq 100", "nameToShow":"Nasdaq 100", "type":"Future/Index" },
        { "id":10, "symbol":"DYU17", "name":"Dax 30 future", "nameToShow":"Dax 30 Future", "type":"Future/Index" },
        { "id":11, "symbol":"VIN17", "name":"Vix future", "nameToShow":"Vix Future", "type":"Future/Index" },
        { "id":12, "symbol":"MXU17", "name":"Cac 30 future", "nameToShow":"Cac 30 Future", "type":"Future/Index" },
        { "id":13, "symbol":"NLU17", "name":"Nikkei 225 future", "nameToShow":"Nikkei 225 Future", "type":"Future/Index" },
        { "id":14, "symbol":"ZNU17", "name":"Treasury 10 yr note future", "nameToShow":"Treasury 10 YR Note Future", "type":"Future/Bond" },
        { "id":15, "symbol":"^EURUSD", "name":"Euro/usd", "nameToShow":"EUR/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":16, "symbol":"^USDJPY", "name":"Usd/jpy", "nameToShow":"USD/JPY", "type":"Currency" },
        { "id":17, "symbol":"FB", "name":"Facebook", "nameToShow":"Facebook", "type":"Stock" },
        { "id":18, "symbol":"UVU17", "name":"Ftse 100 future", "nameToShow":"FTSE 100 Future", "type":"Future/Index" },
        { "id":19, "symbol":"YMU17", "name":"Dow jones future", "nameToShow":"Dow Jones Future", "type":"Future/Index" },
        { "id":20, "symbol":"^AUDUSD", "name":"Aud/usd", "nameToShow":"AUD/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":21, "symbol":"ESU17", "name":"S&p 500 future", "nameToShow":"S&P 500 Future", "type":"Future/Index" },
        { "id":22, "symbol":"XBI", "name":"S&p biotech spdr", "nameToShow":"S&P Biotech SPDR", "type":"ETF/Index" },
        { "id":23, "symbol":"GOOG", "name":"Google", "nameToShow":"Google", "type":"Stock" },
        { "id":24, "symbol":"TSLA", "name":"Tesla", "nameToShow":"Tesla", "type":"Stock" },
        { "id":25, "symbol":"NFLX", "name":"Netflix", "nameToShow":"Netflix", "type":"Stock" },
        { "id":26, "symbol":"V", "name":"Visa", "nameToShow":"Visa", "type":"Stock" },
        { "id":27, "symbol":"BAC", "name":"Bank of america", "nameToShow":"Bank of America", "type":"Stock" },
        { "id":28, "symbol":"MCD", "name":"Mcdonalds", "nameToShow":"McDonald's", "type":"Stock" },
        { "id":29, "symbol":"MSFT", "name":"Microsoft", "nameToShow":"Microsoft", "type":"Stock" },
        { "id":30, "symbol":"JPM", "name":"Jpmorgan chase", "nameToShow":"JPMorgan Chase", "type":"Stock" },
        { "id":31, "symbol":"GS", "name":"Goldman sachs", "nameToShow":"Goldman Sachs", "type":"Stock" },
        { "id":32, "symbol":"HPQ", "name":"Hp", "nameToShow":"HP", "type":"Stock" },
        { "id":33, "symbol":"^USDZAR", "name":"Usd/zar", "nameToShow":"USD/ZAR", "type":"Currency","digitsAfterDecimalPoint":4 },
        { "id":34, "symbol":"^GBPUSD", "name":"Gbp/usd", "nameToShow":"GBP/USD", "type":"Currency","digitsAfterDecimalPoint":4 },
        { "id":35, "symbol":"HYG", "name":"Ishares iboxx High Yield", "nameToShow":"IShares iBoxx $ High Yield", "type":"ETF/Index" },
        { "id":36, "symbol":"^EURJPY", "name":"Eur/jpy", "nameToShow":"EUR/JPY", "type":"Currency" },
        { "id":37, "symbol":"^GBPJPY", "name":"Gbp/jpy", "nameToShow":"GBP/JPY", "type":"Currency" },
        { "id":38, "symbol":"^USDILS", "name":"Usd/ils", "nameToShow":"USD/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":39, "symbol":"MS", "name":"Morgan stanley", "nameToShow":"Morgan Stanley", "type":"Stock"  },
        { "id":40, "symbol":"KO", "name":"The coca-cola company", "nameToShow":"The Coca-Cola Company", "type":"Stock"  },
        { "id":41, "symbol":"^EURILS", "name":"Eur/ils", "nameToShow":"EUR/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        
    ];


@Injectable()
export class AssetsService {

   /*url:string='http://localhost:8080/AA/AssetServlet';*/
   url:string='http://localhost:8080/src/assets/assets-list.json';
  
     
  constructor(private http : Http) { }
    
    
    getAllAssets(): Promise<Asset[]>{
            return Promise.resolve(ASSETS);
        }
    
    
    getAsset(symbol: string): Promise<Asset> {
    return this.getAllAssets()
               .then(assets => assets.find(asset => asset.symbol === symbol));
        }
    
    
    getAllAssetsByType(assetType:string): Promise<Asset[]>{
            
        let filteredAssetsByType = ASSETS.filter(asset=>{
                                                            if(asset.type == assetType){
                                                                    return asset;   
                                                                  }
                                                        });
        
        return Promise.resolve(filteredAssetsByType);
        
        }
    
    
    
    
    
    

}

