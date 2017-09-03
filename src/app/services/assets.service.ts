import { Injectable } from '@angular/core';
import { Asset } from '../asset';

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
        { "id":7, "symbol":"HGQ17", "name":"Copper", "nameToShow":"Copper", "type":"Commodity", "digitsAfterDecimalPoint":3 },
        { "id":8, "symbol":"CLU17", "name":"Crude oil", "nameToShow":"Crude oil", "type":"Commodity" },
        { "id":9, "symbol":"NQU17", "name":"Nasdaq 100 future", "nameToShow":"Nasdaq 100", "type":"Future" },
        { "id":10, "symbol":"EBAY", "name":"Ebay", "nameToShow":"Ebay", "type":"Stock" },
        { "id":11, "symbol":"SPY", "name":"S&p 500 spdr", "nameToShow":"S&P 500 SPDR", "type":"ETF" },
        { "id":12, "symbol":"^USDCAD", "name":"Usd/cad", "nameToShow":"USD/CAD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":13, "symbol":"NLU17", "name":"Nikkei 225 future", "nameToShow":"Nikkei 225", "type":"Future" },
        { "id":14, "symbol":"QQQ", "name":"Nasdaq 100 etf", "nameToShow":"Nasdaq 100", "type":"ETF" },
        { "id":15, "symbol":"^EURUSD", "name":"Euro/usd", "nameToShow":"EUR/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":16, "symbol":"^USDJPY", "name":"Usd/jpy", "nameToShow":"USD/JPY", "type":"Currency" },
        { "id":17, "symbol":"FB", "name":"Facebook", "nameToShow":"Facebook", "type":"Stock" },
        { "id":18, "symbol":"UVU17", "name":"Ftse 100 future", "nameToShow":"FTSE 100", "type":"Future" },
        { "id":19, "symbol":"YMU17", "name":"Dow jones future", "nameToShow":"Dow Jones", "type":"Future" },
        { "id":20, "symbol":"^AUDUSD", "name":"Aud/usd", "nameToShow":"AUD/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":21, "symbol":"ESU17", "name":"S&p 500 future", "nameToShow":"S&P 500", "type":"Future" },
        { "id":22, "symbol":"XBI", "name":"S&p biotech spdr", "nameToShow":"S&P Biotech SPDR", "type":"ETF" },
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
        { "id":35, "symbol":"HYG", "name":"Ishares iboxx high Yield", "nameToShow":"IShares iBoxx $ High Yield", "type":"ETF" },
        { "id":36, "symbol":"^EURJPY", "name":"Eur/jpy", "nameToShow":"EUR/JPY", "type":"Currency" },
        { "id":37, "symbol":"^GBPJPY", "name":"Gbp/jpy", "nameToShow":"GBP/JPY", "type":"Currency" },
        { "id":38, "symbol":"^USDILS", "name":"Usd/ils", "nameToShow":"USD/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":39, "symbol":"MS", "name":"Morgan stanley", "nameToShow":"Morgan Stanley", "type":"Stock"  },
        { "id":40, "symbol":"KO", "name":"Coca-cola", "nameToShow":"Coca-Cola", "type":"Stock"  },
        { "id":41, "symbol":"^EURILS", "name":"Eur/ils", "nameToShow":"EUR/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":42, "symbol":"BA", "name":"Boeing", "nameToShow":"Boeing", "type":"Stock"  },
        { "id":43, "symbol":"TWTR", "name":"Twitter", "nameToShow":"Twitter", "type":"Stock"  },
        /*{ "id":44, "symbol":"LNKD", "name":"Linkedin", "nameToShow":"Linkedin", "type":"Stock"  },*/
        { "id":45, "symbol":"GRPN", "name":"Groupon", "nameToShow":"Groupon", "type":"Stock"  },
        { "id":46, "symbol":"C", "name":"Citigroup", "nameToShow":"Citigroup", "type":"Stock"  },
        { "id":47, "symbol":"TRU17", "name":"Iron ore 62%", "nameToShow":"Iron ore 62%", "type":"Commodity" },
        { "id":48, "symbol":"^USDMXN", "name":"Usd/mxn", "nameToShow":"USD/MXN", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":49, "symbol":"^USDTRY", "name":"Usd/try", "nameToShow":"USD/TRY", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":50, "symbol":"^USDBRL", "name":"Usd/brl", "nameToShow":"USD/BRL", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":51, "symbol":"^USDPLN", "name":"Usd/pln", "nameToShow":"USD/PLN", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":52, "symbol":"TLT", "name":"Treasury 20+ year bond", "nameToShow":"Treasury 20+ Year Bond", "type":"ETF"  },
        { "id":53, "symbol":"XLF", "name":"Financials spdr", "nameToShow":"Financials SPDR", "type":"ETF"  },
        { "id":54, "symbol":"TEVA", "name":"Teva", "nameToShow":"Teva", "type":"Stock"  },
        { "id":55, "symbol":"QAV17", "name":"Brent oil", "nameToShow":"Brent Oil", "type":"Commodity" },
        { "id":56, "symbol":"IYT", "name":"Dow jones transportation etf", "nameToShow":"Dow Jones Transportation", "type":"ETF"  },
        { "id":57, "symbol":"IMIB.LS", "name":"Ftse mib etf", "nameToShow":"FTSE MIB", "type":"ETF"  },
        { "id":58, "symbol":"WMT", "name":"Walmart", "nameToShow":"Walmart", "type":"Stock"  },
        { "id":59, "symbol":"JCP", "name":"J c penny", "nameToShow":"J.C.Penny", "type":"Stock"  },
        { "id":60, "symbol":"WFC", "name":"Wells fargo", "nameToShow":"Wells Fargo", "type":"Stock"  },
        { "id":61, "symbol":"DPZ", "name":"Dominos pizza", "nameToShow":"Domino's Pizza", "type":"Stock"  },
        { "id":62, "symbol":"SBUX", "name":"Starbucks", "nameToShow":"Starbucks", "type":"Stock"  },
        { "id":63, "symbol":"XOM", "name":"Exxon mobil", "nameToShow":"Exxon Mobil", "type":"Stock"  },
        { "id":64, "symbol":"JNJ", "name":"Johnson & johnson", "nameToShow":"Johnson & Johnson", "type":"Stock"  },
        { "id":65, "symbol":"CAT", "name":"Caterpillar", "nameToShow":"Caterpillar", "type":"Stock"  },
        { "id":66, "symbol":"^GBPILS", "name":"Gbp/ils", "nameToShow":"GBP/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":67, "symbol":"^EURAUD", "name":"Eur/aud", "nameToShow":"EUR/AUD", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":68, "symbol":"^AUDNZD", "name":"Aud/nzd", "nameToShow":"AUD/NZD", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":69, "symbol":"^AUDILS", "name":"Aud/ils", "nameToShow":"AUD/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":70, "symbol":"^EURGBP", "name":"Eur/gbp", "nameToShow":"EUR/GBP", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":71, "symbol":"GE", "name":"General electric", "nameToShow":"General Electric", "type":"Stock"  },
        { "id":72, "symbol":"AXP", "name":"American express", "nameToShow":"American Express", "type":"Stock"  },
        { "id":73, "symbol":"PG", "name":"Procter & gamble", "nameToShow":"Procter & Gamble", "type":"Stock"  },
        { "id":74, "symbol":"^USDHUF", "name":"Usd/huf", "nameToShow":"USD/HUF", "type":"Currency"  },
        { "id":75, "symbol":"^EURHUF", "name":"Eur/huf", "nameToShow":"EUR/HUF", "type":"Currency"  },
        { "id":76, "symbol":"^EURPLN", "name":"Eur/pln", "nameToShow":"EUR/PLN", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":77, "symbol":"^EURCHF", "name":"Eur/chf", "nameToShow":"EUR/CHF", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":78, "symbol":"^AUDJPY", "name":"Aud/jpy", "nameToShow":"AUD/JPY", "type":"Currency"  },
        { "id":79, "symbol":"^NZDJPY", "name":"Nzd/jpy", "nameToShow":"NZD/JPY", "type":"Currency"  },
        { "id":80, "symbol":"^USDSEK", "name":"Usd/sek", "nameToShow":"USD/SEK", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":81, "symbol":"^USDNOK", "name":"Usd/nok", "nameToShow":"USD/NOK", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":82, "symbol":"^USDRUB", "name":"Usd/rub", "nameToShow":"USD/RUB", "type":"Currency"  },
        { "id":83, "symbol":"^XPTUSD", "name":"Platinum", "nameToShow":"Platinum", "type":"Commodity" },
        { "id":84, "symbol":"^XPDUSD", "name":"Palladium", "nameToShow":"Palladium", "type":"Commodity" },
        { "id":85, "symbol":"NGU17", "name":"Natural gas", "nameToShow":"Natural Gas", "type":"Commodity", "digitsAfterDecimalPoint":3 },
        { "id":86, "symbol":"^USDCNH", "name":"Usd/cnh", "nameToShow":"USD/CNH", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":87, "symbol":"^USDCHF", "name":"Usd/chf", "nameToShow":"USD/CHF", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":88, "symbol":"^USDHKD", "name":"Usd/hkd", "nameToShow":"USD/HKD", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":89, "symbol":"^XAUEUR", "name":"Gold in eur", "nameToShow":"Gold in EUR", "type":"Commodity" },
        { "id":90, "symbol":"AA", "name":"Alcoa", "nameToShow":"Alcoa", "type":"Stock"  },
        
        
    ];


@Injectable()
export class AssetsService {

     
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

