import {ChartConfig} from './chart-config';

export class BarChartConfig extends ChartConfig {
    
    private _colorMultiplier: number;
    private _isShowBarData: boolean;
    private _isEnableTooltip: boolean;
    private _isNormalized: boolean;
    private _dataNameTop: number;
    private _barDataPattern: [RegExp, string];
    private _miniGridLeftArr: number[];

    constructor(totalBarsWidth: number, topMargin: number, bottomMargin: number, isShowBarData: boolean, isEnableTooltip: boolean,
                colorMultiplier: number){
        super(totalBarsWidth, topMargin, bottomMargin);
        this._isShowBarData = isShowBarData;
        this._isEnableTooltip = isEnableTooltip;
        this._colorMultiplier = colorMultiplier;
        this._barDataPattern = [/([-]?\d+[.]?\d{0,2}).*/g, "$1%"];
    }
    

    
    get colorMultiplier(): number{
        return this._colorMultiplier;    
    }
    
    get isShowBarData(): boolean{
        return this._isShowBarData;    
    }
    
    get isEnableTooltip(): boolean{
        return this._isEnableTooltip;    
    }
    
    get dataNameTop(): number{
        return this._dataNameTop;    
    }

    set dataNameTop(dataNameTop: number){
        this._dataNameTop = dataNameTop;
    }
    
    get barDataPattern(): [RegExp, string]{
        return this._barDataPattern;    
    }

    set barDataPattern(barDataPattern: [RegExp, string]){
        this._barDataPattern = barDataPattern;
    }
    
    get miniGridLeftArr(): number[]{
        return this._miniGridLeftArr;    
    }

    set miniGridLeftArr(miniGridLeftArr: number[]){
        this._miniGridLeftArr = miniGridLeftArr;
    }

}
