import { Asset } from './asset'
import { Candlestick } from './candlestick'

export class AssetInRelativePerformance {
    
    assetDetails:Asset;
    lastPrice:number;
    historicCandles: Candlestick[];
    return:number;      // return to display in template
    dayReturn:number;   // for calculations... (including the week, month, etc.)
    weekReturn:number;
    monthReturn:number;
    threeMonthReturn:number;
    yearReturn:number;
    
    barTop;
    barHeight;
    returnTop;
    
    constructor() { }
    
    
}
