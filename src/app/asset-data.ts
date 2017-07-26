export interface AssetData {
    
    id?:number;
    startTime?:string;
    open?:number;
    low?:number;
    high?:number;
    close?:number;
    closeAsNumber?:number;
    netChange?:number;
    netChangePercent?:number;
    volume?:number;
    monthlyAverageVolume?:number;
    previousClose?:number;
    fiftyTwoWkHigh?:number;
    fiftyTwoWkLow?:number;
    twelveMnthPct?:number;
    marketCap?:number;
    dividendYieldAnnual?:number;
    impliedVolatility?:any;
    expirationDate?:string;
}
