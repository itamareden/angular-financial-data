export class ChartData {
    
    private _name: string;
    private _symbol: string;
    private _dataArr: number[];
    private _dataNames: string[];
    private _patternedDataArr: string[];
    private _colors: string[];
    private _left: number = 0;
    private _top: number[] = [];
    private _width: number = 0;
    private _height: number[] = [];
    private _totalDataSum: number;
    private _barDataTop: number;

    constructor(name: string, symbol: string, dataArr: number[], dataNames: string[], colors: string[]){
        this._name = name;
        this._symbol = symbol;
        this._dataArr = dataArr;
        this._dataNames = dataNames;
        this._colors = colors;
    }
    
    get name(): string{
        return this._name;    
    }
    
    get symbol(): string{
        return this._symbol;    
    }
    
    get dataArr(): number[]{
        return this._dataArr;    
    }
    
    set dataArr(dataArr: number[]){
        this._dataArr = dataArr;
    }
    
    get dataNames(): string[]{
        return this._dataNames;    
    }
    
    set dataNames(dataNames: string[]){
        this._dataNames = dataNames;
    }
    
    get patternedDataArr(): string[]{
        return this._patternedDataArr;    
    }
    
    set patternedDataArr(patternedDataArr: string[]){
        this._patternedDataArr = patternedDataArr;
    }
    
    get colors(): string[]{
        return this._colors;    
    }
    
    set colors(colors: string[]){
        this._colors = colors;
    }
    
    get left(): number{
        return this._left;    
    }
    
    set left(left: number){
        this._left = left;
    }
    
    get top(): number[]{
        return this._top;    
    }
    
    set top(top: number[]){
        this._top = top;
    }
    
    get width(): number{
        return this._width;    
    }
    
    set width(width: number){
        this._width = width;
    }
    
    get height(): number[]{
        return this._height;    
    }
    
    set height(height: number[]){
        this._height = height;
    }
    
    get totalDataSum(): number{
        return this._totalDataSum;    
    }
    
    set totalDataSum(totalDataSum: number){
        this._totalDataSum = totalDataSum;
    }
    
    get barDataTop(): number{
        return this._barDataTop;    
    }
    
    set barDataTop(barDataTop: number){
        this._barDataTop = barDataTop;
    }
}
