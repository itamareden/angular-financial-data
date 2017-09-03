export interface AssetInMarketMoversTable {
    
    name?:string;
    symbol?:string;
    lastPrice?:number
    digitsAfterDecimalPoint?:number;
    netChangePercent?:number;
    volume?:number;
    volumeNotation?:string;     // M for millions , B for billions 
    
}
